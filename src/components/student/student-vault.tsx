'use client';
import { useState, useRef } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UploadCloud, File, Trash2, Download, Loader2 } from 'lucide-react';
import type { VaultFile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';

export function StudentVault({ files: initialFiles }: { files: VaultFile[] }) {
  const [files, setFiles] = useState(initialFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      setIsUploading(true);
      const storage = getStorage();
      const filePath = `users/${user.uid}/vault/${file.name}`;
      const storageRef = ref(storage, filePath);
      
      try {
        const uploadTask = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(uploadTask.ref);

        const newFile: Omit<VaultFile, 'id'> = {
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          date: new Date().toISOString(),
          url: downloadUrl,
          path: filePath,
        };

        const docRef = await addDoc(collection(firestore, `students/${user.uid}/vault`), newFile);
        
        setFiles((prev) => [{...newFile, id: docRef.id}, ...prev]);

        toast({
          title: 'File Uploaded',
          description: `${file.name} has been added to your vault.`,
        });

      } catch(e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Upload failed', description: 'Could not upload file.'})
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async (fileToDelete: VaultFile) => {
    if (!user) return;
    
    try {
        // Delete from storage
        const storage = getStorage();
        const fileRef = ref(storage, fileToDelete.path);
        await deleteObject(fileRef);

        // Delete from firestore
        await deleteDoc(doc(firestore, `students/${user.uid}/vault`, fileToDelete.id));

        setFiles((prev) => prev.filter((file) => file.id !== fileToDelete.id));
        toast({
            variant: 'destructive',
            title: 'File Deleted',
            description: 'The selected file has been removed from your vault.',
        });
    } catch(e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Delete failed', description: 'Could not delete file.'})
    }

  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>My Personal Vault</CardTitle>
            <CardDescription>
                Store and manage your important documents and assignments.
            </CardDescription>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <Button onClick={handleUploadClick} disabled={isUploading}>
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            Upload File
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  {file.name}
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{new Date(file.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(file)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
