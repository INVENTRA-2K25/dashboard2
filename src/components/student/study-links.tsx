import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { StudyLink } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';

export function StudyLinks({ links }: { links: StudyLink[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Helpful Study Links</CardTitle>
        <CardDescription>Curated resources to help you excel.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Card key={link.id} className="flex flex-col">
            <CardHeader className="flex-1">
              <CardTitle className="text-lg">{link.title}</CardTitle>
              <Badge variant="outline" className="w-fit">{link.subject}</Badge>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm" className="w-full">
                <Link href={link.url} target="_blank">
                  Visit Resource <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
