export function Footer() {
  return (
    <footer className="w-full flex justify-center p-5 border-t">
      <p className="text-xs text-muted-foreground text-center font-medium">
        © {new Date().getFullYear()} PostScheduler · Built with n8n + Gemini AI
        · Not affiliated with LinkedIn
      </p>
    </footer>
  );
}
