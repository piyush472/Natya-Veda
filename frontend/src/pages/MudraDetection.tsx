import { Camera, Hand, Sparkles } from "lucide-react";

const MudraDetection = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            Mudra Detection
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            AI-powered hand gesture recognition to identify classical dance mudras in real-time.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Webcam placeholder */}
          <div className="lg:col-span-3">
            <div className="flex aspect-video flex-col items-center justify-center rounded-xl border border-dashed border-gold-subtle bg-card">
              <Camera className="h-16 w-16 text-muted-foreground/40" />
              <p className="mt-4 text-sm text-muted-foreground">Webcam feed will appear here</p>
              <p className="mt-1 text-xs text-muted-foreground/60">MediaPipe integration coming soon</p>
            </div>
          </div>

          {/* Detection results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detected Mudra */}
            <div className="rounded-xl border border-gold-subtle bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Hand className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground">Detected Mudra</h2>
              </div>
              <div className="mt-4 rounded-lg bg-muted p-4 text-center">
                <p className="font-display text-2xl font-bold text-foreground">Anjali</p>
                <p className="mt-1 text-xs text-muted-foreground">Sample detection result</p>
              </div>
            </div>

            {/* Cultural Meaning */}
            <div className="rounded-xl border border-gold-subtle bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground">Cultural Meaning</h2>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                The Anjali mudra represents salutation, prayer, and reverence. It is used across multiple
                classical dance forms to convey devotion and respect.
              </p>
            </div>

            {/* Associated Rasa */}
            <div className="rounded-xl border border-gold-subtle bg-card p-6">
              <h3 className="font-display text-sm font-semibold text-foreground">Associated Rasa</h3>
              <span className="mt-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                Shanta (Peace)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MudraDetection;
