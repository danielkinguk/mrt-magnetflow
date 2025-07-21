import { SidebarTrigger } from "./ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { usePathname } from "next/navigation";
import { Maximize, Minimize, RefreshCw, Grid3X3, Share2, Users, Monitor, Mail, Printer, Copy, Link, Download, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const { isMaximized, toggle } = useFullscreen();
  const pathname = usePathname();
  const isBoardPage = pathname.startsWith('/boards/');

  const handleShareCollaborate = () => {
    // Generate collaboration link
    const shareUrl = `${window.location.origin}${pathname}?collaborate=true`;
    navigator.clipboard.writeText(shareUrl);
    console.log('Collaboration link copied:', shareUrl);
    // TODO: Add toast notification
  };

  const handleShareBigScreen = () => {
    // Open in new window for big screen display
    const bigScreenUrl = `${window.location.origin}${pathname}?display=bigscreen`;
    const newWindow = window.open(bigScreenUrl, '_blank', 'width=1920,height=1080');
    
    // Maximize the window after it opens
    if (newWindow) {
      newWindow.addEventListener('load', () => {
        try {
          // Try to maximize the window
          newWindow.moveTo(0, 0);
          newWindow.resizeTo(screen.width, screen.height);
        } catch (e) {
          // Fallback: just ensure it's large enough
          console.log('Could not maximize window, using fallback size');
        }
      });
    }
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Dashboard Share');
    const body = encodeURIComponent(`Check out this dashboard: ${window.location.href}`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const handleSharePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    console.log('Link copied to clipboard');
    // TODO: Add toast notification
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    console.log('Downloading PDF...');
    // This would typically use a library like jsPDF or html2canvas
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this dashboard: ${window.location.href}`);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleTidyUp = () => {
    console.log('=== NEW TIDY FUNCTION CALLED ===');
    // Find all column elements and align them
    const columns = document.querySelectorAll('[data-column-id]');
    console.log('Tidy function called, found columns:', columns.length);
    
    // Filter out the unassigned area and toolbar
    const resourceColumns = Array.from(columns).filter(col => {
      const type = col.getAttribute('data-column-type');
      return type === 'vehicle' || type === 'team';
    });
    
    console.log('Resource columns to align:', resourceColumns.length);
    
    if (isMaximized) {
      // Center justify when maximized
      const totalWidth = resourceColumns.length * 340;
      const windowWidth = window.innerWidth;
      const startX = (windowWidth - totalWidth) / 2;
      
      resourceColumns.forEach((column, index) => {
        const element = column as HTMLElement;
        if (element) {
          // Find the parent div that has the absolute positioning
          const parentDiv = element.closest('.absolute') as HTMLElement;
          if (parentDiv) {
            parentDiv.style.left = `${startX + (index * 340)}px`;
            parentDiv.style.top = '120px';
            console.log(`Centered column ${index} to position: ${startX + (index * 340)}px, 120px`);
          } else {
            console.log('Could not find parent div for column:', column);
          }
        }
      });
    } else {
      // Normal left-aligned positioning when not maximized
      resourceColumns.forEach((column, index) => {
        const element = column as HTMLElement;
        if (element) {
          // Find the parent div that has the absolute positioning
          const parentDiv = element.closest('.absolute') as HTMLElement;
          if (parentDiv) {
            parentDiv.style.left = `${index * 340 + 20}px`;
            parentDiv.style.top = '120px';
            console.log(`Aligned column ${index} to position: ${index * 340 + 20}px, 120px`);
          } else {
            console.log('Could not find parent div for column:', column);
          }
        }
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
            <SidebarTrigger />
        </div>
        <div className="flex items-center gap-2">
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="outline" size="icon" title="Share">
                 <Share2 className="h-4 w-4" />
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-56">
               <DropdownMenuLabel>Share Dashboard</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={handleShareCollaborate}>
                 <Users className="mr-2 h-4 w-4" />
                 <span>Invite Collaborators</span>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={handleShareBigScreen}>
                 <Monitor className="mr-2 h-4 w-4" />
                 <span>Big Screen Display</span>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={handleShareEmail}>
                 <Mail className="mr-2 h-4 w-4" />
                 <span>Share via Email</span>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={handleShareWhatsApp}>
                 <MessageCircle className="mr-2 h-4 w-4" />
                 <span>Share via WhatsApp</span>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={handleSharePrint}>
                 <Printer className="mr-2 h-4 w-4" />
                 <span>Print Dashboard</span>
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={handleCopyLink}>
                 <Link className="mr-2 h-4 w-4" />
                 <span>Copy Link</span>
               </DropdownMenuItem>
               <DropdownMenuItem onClick={handleDownloadPDF}>
                 <Download className="mr-2 h-4 w-4" />
                 <span>Download PDF</span>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
           {isBoardPage && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleTidyUp} 
              title="Tidy Up Resources"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
           )}
           <Button variant="outline" size="icon" onClick={toggle} title={isMaximized ? 'Minimize' : 'Maximize'}>
            {isMaximized ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
