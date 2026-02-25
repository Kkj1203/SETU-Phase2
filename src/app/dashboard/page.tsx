import { SetuLogo } from "@/components/setu-logo";

export default function DashboardHub() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <SetuLogo className="size-16 text-primary" />
      <h1 className="text-3xl font-bold mt-4">Welcome to SETU</h1>
      <p className="mt-2 text-muted-foreground">
        You are logged in. Select a specific dashboard from the sidebar to view information.
      </p>
    </div>
  );
}
