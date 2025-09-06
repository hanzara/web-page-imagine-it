import { useState, useEffect, createContext, useContext } from "react";
import { customerSegments, type CustomerSegment } from "@/components/SegmentSelector";

interface SegmentContextType {
  selectedSegment: CustomerSegment | null;
  setSegment: (segmentId: string) => void;
  clearSegment: () => void;
  isSegmentSelected: boolean;
}

const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

export const SegmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);

  // Load segment from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('universal-pay-segment');
    if (stored) {
      setSelectedSegmentId(stored);
    }
  }, []);

  const setSegment = (segmentId: string) => {
    setSelectedSegmentId(segmentId);
    localStorage.setItem('universal-pay-segment', segmentId);
  };

  const clearSegment = () => {
    setSelectedSegmentId(null);
    localStorage.removeItem('universal-pay-segment');
  };

  const selectedSegment = selectedSegmentId 
    ? customerSegments.find(s => s.id === selectedSegmentId) || null
    : null;

  return (
    <SegmentContext.Provider value={{
      selectedSegment,
      setSegment,
      clearSegment,
      isSegmentSelected: !!selectedSegment
    }}>
      {children}
    </SegmentContext.Provider>
  );
};

export const useCustomerSegment = () => {
  const context = useContext(SegmentContext);
  if (!context) {
    throw new Error('useCustomerSegment must be used within SegmentProvider');
  }
  return context;
};