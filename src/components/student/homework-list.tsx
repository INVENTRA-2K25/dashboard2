import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Homework } from '@/lib/types';
import { cn } from '@/lib/utils';

export function HomeworkList({ homeworks }: { homeworks: Homework[] }) {
  const getStatusVariant = (status: Homework['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Homework</CardTitle>
        <CardDescription>Here's a list of your upcoming and past assignments.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {homeworks.map((hw) => (
              <TableRow key={hw.id}>
                <TableCell className="font-medium">{hw.title}</TableCell>
                <TableCell>{hw.subject}</TableCell>
                <TableCell>{hw.dueDate}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={getStatusVariant(hw.status)} className="capitalize">{hw.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
