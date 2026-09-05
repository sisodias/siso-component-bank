import { useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Label } from "./label";
import { Input } from "./input";
import { Edit } from "lucide-react";
import { Textarea } from "./textarea";

export function EditProfile({ profile, setProfile, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = () => {
    setProfile(formData);
    setIsOpen(false);
  };

  const handleOpenChange = (open) => {
    if (open) {
      setFormData(profile);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost">
            <Edit className="size-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="img" className="text-right">
              Image URL
            </Label>
            <Input
              id="img"
              value={formData.img}
              placeholder="Enter image URL"
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              placeholder="Enter your Full Name"
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">
              User Id
            </Label>
            <Input
              id="id"
              value={formData.id}
              placeholder="Enter your User Id"
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="summary" className="text-right">
              Summary
            </Label>
            <Textarea
              id="summary"
              value={formData.summary}
              placeholder="Enter your summary"
              onChange={handleChange}
              className="col-span-3 h-20"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
