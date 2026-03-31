import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSendEmail } from "../hooks/useQueries";

interface ComposeViewProps {
  onSent: () => void;
}

function parseEmails(value: string): string[] {
  return value
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export function ComposeView({ onSent }: ComposeViewProps) {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(false);

  const { mutateAsync: sendEmail, isPending } = useSendEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toList = parseEmails(to);
    if (toList.length === 0) {
      toast.error("Please enter at least one recipient.");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter a subject.");
      return;
    }

    try {
      await sendEmail({
        to: toList,
        cc: parseEmails(cc),
        bcc: parseEmails(bcc),
        subject: subject.trim(),
        body: body.trim(),
      });
      toast.success("Email sent successfully!");
      setTo("");
      setCc("");
      setBcc("");
      setSubject("");
      setBody("");
      setShowCcBcc(false);
      onSent();
    } catch (_err) {
      toast.error("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="font-display text-2xl text-foreground">New Message</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Compose and send an email. Separate multiple recipients with commas.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        data-ocid="compose.panel"
        className="bg-card border border-border rounded-lg shadow-card overflow-hidden"
      >
        {/* To field */}
        <div className="flex items-center border-b border-border px-4 py-3 gap-3">
          <Label
            htmlFor="to"
            className="w-14 text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0"
          >
            To
          </Label>
          <Input
            id="to"
            data-ocid="compose.input"
            type="text"
            placeholder="recipient@example.com, another@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            disabled={isPending}
            className="border-0 shadow-none focus-visible:ring-0 px-0 text-sm"
            autoComplete="email"
          />
          <button
            type="button"
            onClick={() => setShowCcBcc((v) => !v)}
            className="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            aria-expanded={showCcBcc}
            aria-label="Toggle CC and BCC fields"
          >
            CC/BCC
            {showCcBcc ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* CC/BCC fields */}
        {showCcBcc && (
          <>
            <div className="flex items-center border-b border-border px-4 py-3 gap-3">
              <Label
                htmlFor="cc"
                className="w-14 text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0"
              >
                CC
              </Label>
              <Input
                id="cc"
                data-ocid="compose.cc.input"
                type="text"
                placeholder="cc@example.com"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                disabled={isPending}
                className="border-0 shadow-none focus-visible:ring-0 px-0 text-sm"
                autoComplete="email"
              />
            </div>
            <div className="flex items-center border-b border-border px-4 py-3 gap-3">
              <Label
                htmlFor="bcc"
                className="w-14 text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0"
              >
                BCC
              </Label>
              <Input
                id="bcc"
                data-ocid="compose.bcc.input"
                type="text"
                placeholder="bcc@example.com"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                disabled={isPending}
                className="border-0 shadow-none focus-visible:ring-0 px-0 text-sm"
                autoComplete="email"
              />
            </div>
          </>
        )}

        {/* Subject */}
        <div className="flex items-center border-b border-border px-4 py-3 gap-3">
          <Label
            htmlFor="subject"
            className="w-14 text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0"
          >
            Subject
          </Label>
          <Input
            id="subject"
            data-ocid="compose.subject.input"
            type="text"
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isPending}
            className="border-0 shadow-none focus-visible:ring-0 px-0 text-sm"
          />
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          <Textarea
            id="body"
            data-ocid="compose.textarea"
            placeholder="Write your message here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={isPending}
            rows={10}
            className="border-0 shadow-none focus-visible:ring-0 px-0 resize-none text-sm leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div
          className={cn(
            "flex items-center justify-between px-4 py-3 border-t border-border",
            "bg-secondary/40",
          )}
        >
          <p className="text-xs text-muted-foreground">
            {body.length > 0 && `${body.length} characters`}
          </p>
          <Button
            type="submit"
            data-ocid="compose.submit_button"
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
