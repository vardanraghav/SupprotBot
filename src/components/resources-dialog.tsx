"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Download } from 'lucide-react';
import { Separator } from "./ui/separator";

const CrisisCard = () => (
    <div className="mt-4 p-4 border-2 border-dashed border-primary rounded-lg bg-primary/10">
        <h4 className="font-bold text-primary">Offline Crisis Card</h4>
        <p className="text-sm mt-1">Keep these numbers handy. You are not alone.</p>
        <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
            <li><strong>National Suicide Prevention Lifeline (US):</strong> 988</li>
            <li><strong>AASRA (India):</strong> +91-9820466726</li>
            <li><strong>Vandrevala Foundation (India):</strong> +91 9999 666 555</li>
            <li><strong>Crisis Text Line (Global):</strong> Text HOME to 741741</li>
            <li><strong>Your local emergency number:</strong> [e.g., 112, 911]</li>
        </ul>
        <Button variant="outline" size="sm" className="mt-4 w-full">
            <Download className="mr-2 h-4 w-4"/>
            Download for Offline Use
        </Button>
    </div>
)

export function ResourcesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
            <LifeBuoy className="h-5 w-5"/>
            <span className="hidden sm:inline">Help & Resources</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mental Health Resources</DialogTitle>
          <DialogDescription>
            You are not alone. Here are some resources that can help.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
            <div>
                <h3 className="font-semibold text-foreground">Immediate Help (24/7)</h3>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                    <li><strong>AASRA (India):</strong> Call +91-9820466726</li>
                    <li><strong>Vandrevala Foundation (India):</strong> Call +91 9999 666 555</li>
                    <li><strong>National Suicide Prevention Lifeline (US):</strong> Call or text 988</li>
                    <li><strong>Crisis Text Line (Global):</strong> Text "HOME" to 741741</li>
                </ul>
            </div>
             <Separator />
            <div>
                <h3 className="font-semibold text-foreground">Find a Professional</h3>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                    <li><a href="#" className="underline hover:text-primary">Therapist Handoff Summary (Coming Soon)</a></li>
                    <li><a href="https://www.therapizeindia.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Therapize India</a></li>
                    <li><a href="https://www.betterhelp.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">BetterHelp (Global)</a></li>
                </ul>
            </div>

            <CrisisCard />
        </div>
        <DialogFooter>
            <p className="text-xs text-muted-foreground text-center w-full">If you are in immediate danger, please contact your local emergency services.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
