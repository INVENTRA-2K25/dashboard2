import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bgImage = PlaceHolderImages.find(img => img.id === 'login-background');

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
        {bgImage && (
             <Image
                src={bgImage.imageUrl}
                alt={bgImage.description}
                fill
                className="object-cover -z-10"
                data-ai-hint={bgImage.imageHint}
                priority
            />
        )}
      <div className="absolute inset-0 bg-background/50 -z-10" />
      {children}
    </main>
  );
}
