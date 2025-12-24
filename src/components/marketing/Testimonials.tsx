import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Engineering Manager at TechCorp",
    content: "This platform has transformed how our distributed team collaborates. We've reduced meeting time by 40% and shipped features 2x faster.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "CEO at StartupXYZ",
    content: "The AI automation features are game-changing. What used to take hours now happens automatically. Best investment we've made.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Product Designer",
    content: "Finally, a tool that actually understands remote work. The integrations work flawlessly and the UI is beautiful.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="container py-24 bg-muted/50">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Loved by Teams Worldwide
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          See what our customers have to say about their experience.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
