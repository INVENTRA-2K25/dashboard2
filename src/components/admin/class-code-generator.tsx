'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Copy, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

const classes = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
const divisions = ['A', 'B'];

type ClassCode = {
    id?: string;
    code: string;
    class: string;
    division: string;
    date: string;
}

export function ClassCodeGenerator() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const firestore = useFirestore();
  const codesQuery = useMemoFirebase(() => collection(firestore, 'classCodes'), [firestore]);
  const { data: generatedCodes, isLoading } = useCollection<ClassCode>(codesQuery);

  const { toast } = useToast();

  const generateCode = async () => {
    if (!selectedClass || !selectedDivision) {
      toast({
        variant: 'destructive',
        title: 'Selection Required',
        description: 'Please select a class and a division.',
      });
      return;
    }
    setIsGenerating(true);
    const newCode = {
        code: `${selectedClass}${selectedDivision}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        class: selectedClass,
        division: selectedDivision,
        date: new Date().toISOString(),
    };
    
    await addDocumentNonBlocking(collection(firestore, 'classCodes'), newCode);
    
    toast({
        title: "Code Generated",
        description: `New code ${newCode.code} created successfully.`
    })
    setIsGenerating(false);
  };

  const copyToClipboard = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: 'The class code has been copied to your clipboard.',
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle>Class Code Generator</CardTitle>
                <CardDescription>
                Generate unique codes for students and teachers to join a class.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex space-x-2">
                <Select onValueChange={setSelectedClass} value={selectedClass}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                    {classes.map((c) => (
                        <SelectItem key={c} value={c}>
                        Class {c}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <Select onValueChange={setSelectedDivision} value={selectedDivision}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent>
                    {divisions.map((d) => (
                        <SelectItem key={d} value={d}>
                        Division {d}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <Button onClick={generateCode} disabled={isGenerating} className="gap-2">
                    {isGenerating ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                    Generate
                </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Generated Codes</CardTitle>
                <CardDescription>List of active class codes.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> : (
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {generatedCodes?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-mono font-semibold">{item.code}</TableCell>
                            <TableCell>Class {item.class} - {item.division}</TableCell>
                            <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(item.code)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
