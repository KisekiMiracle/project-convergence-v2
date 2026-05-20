import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify-icon/react";

interface Props {
  children: React.ReactElement;
  stats: Record<string, string | number>;
  firstMetAt: Date;
}

export function CharacterDialog({ children, stats, firstMetAt }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl!">
        <DialogHeader>
          <DialogTitle>
            <h1 className="flex items-center gap-1 font-bold">
              <span>{stats.name}</span>
              <span>{stats.lastName}</span>
            </h1>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            <Icon icon="ic:baseline-date-range" width="16" height="16" />
            <span className="font-semibold">First Met At:</span>
            <time>{new Date(firstMetAt).toLocaleDateString()}</time>
          </DialogDescription>
          <hr />
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4"></div>
      </DialogContent>
    </Dialog>
  );
}
