import EmailClient "email/emailClient";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type EmailStatus = {
    #sentSuccessfully;
    #failed : Text;
  };

  type EmailRecord = {
    id : Nat;
    timestamp : Time.Time;
    to : [Text];
    cc : [Text];
    bcc : [Text];
    subject : Text;
    body : Text;
    status : EmailStatus;
  };

  module EmailRecord {
    public func compare(record1 : EmailRecord, record2 : EmailRecord) : Order.Order {
      Int.compare(record2.timestamp, record1.timestamp);
    };
  };

  let emailHistory = Map.empty<Nat, EmailRecord>();
  var nextEmailId = 0;

  public shared ({ caller }) func sendAndRecordEmail(to : [Text], cc : [Text], bcc : [Text], subject : Text, body : Text) : async Nat {
    let id = nextEmailId;
    nextEmailId += 1;

    let timestamp = Time.now();

    let sendResult = await EmailClient.sendRawEmail(
      "no-reply",
      to,
      cc,
      bcc,
      subject,
      body,
    );

    let status : EmailStatus = switch (sendResult) {
      case (#ok) { #sentSuccessfully };
      case (#err(error)) { #failed(error) };
    };

    let record : EmailRecord = {
      id;
      timestamp;
      to;
      cc;
      bcc;
      subject;
      body;
      status;
    };

    emailHistory.add(id, record);
    id;
  };

  public query ({ caller }) func getEmailHistory() : async [EmailRecord] {
    emailHistory.values().toArray().sort();
  };

  public query ({ caller }) func getEmail(id : Nat) : async EmailRecord {
    switch (emailHistory.get(id)) {
      case (?email) { email };
      case (null) { Runtime.trap("Email not found") };
    };
  };
};
