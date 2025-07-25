// TypeScript declaration for jsPDF autotable plugin
import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (...args: any[]) => void;
    lastAutoTable?: { finalY: number };
  }
}

declare module 'jspdf-autotable';
