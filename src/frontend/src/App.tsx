import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Mail, PenLine, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ComposeView } from "./components/ComposeView";
import { SentView } from "./components/SentView";

type Tab = "compose" | "sent";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("compose");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="bg-sidebar border-b border-sidebar-border shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary/20">
            <Mail className="w-5 h-5 text-sidebar-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl text-sidebar-foreground leading-tight">
              Mailer
            </h1>
            <p className="text-xs text-sidebar-foreground/60 leading-none">
              Send & track your emails
            </p>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav
        className="bg-sidebar border-b border-sidebar-border"
        aria-label="Main navigation"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1">
          <NavTab
            id="compose"
            label="Compose"
            icon={<PenLine className="w-4 h-4" />}
            active={activeTab === "compose"}
            onClick={() => setActiveTab("compose")}
          />
          <NavTab
            id="sent"
            label="Sent"
            icon={<Send className="w-4 h-4" />}
            active={activeTab === "sent"}
            onClick={() => setActiveTab("sent")}
          />
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "compose" ? (
            <motion.div
              key="compose"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ComposeView onSent={() => setActiveTab("sent")} />
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <SentView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

function NavTab({
  id,
  label,
  icon,
  active,
  onClick,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`nav.${id}.tab`}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
        active
          ? "border-sidebar-primary text-sidebar-primary"
          : "border-transparent text-sidebar-foreground/60 hover:text-sidebar-foreground/90",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
