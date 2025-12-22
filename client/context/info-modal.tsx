'use client';
import { X } from 'lucide-react';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export interface ModalProps {
  type: 'error' | 'info' | 'success' | null;
  message: string | null;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const ModalContext = createContext<{
  type: ModalProps['type'];
  message: string | null;
  setInfo: (type: ModalProps['type'], message: string | null) => void;
}>({
  type: 'info',
  message: '',
  setInfo: () => {},
});

const ModalContextProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<ModalProps['type']>(null);
  const [message, setMessage] = useState<ModalProps['message']>(null);
  const setInfo = (
    type: ModalProps['type'],
    message: ModalProps['message']
  ) => {
    setType(type);
    setMessage(message);
  };

  return (
    <ModalContext.Provider value={{ type, message, setInfo }}>
      {children}
      <InfoModal />
    </ModalContext.Provider>
  );
};

const InfoModal = () => {
  const { type, message, setInfo } = useContext(ModalContext);
  const getStyle = (type: ModalProps['type']) => {
    switch (type) {
      case 'success':
        return 'bg-[#DEFFD8D0] text-[#1DAE00] border-[#1DAE00]';
      case 'info':
        return 'bg-[#EBEBEBD0] text-[#848484] border-[#848484]';
      case 'error':
        return 'bg-[#FFDCDDD0] text-[#FF383C] border-[#FF383C]';
      default:
        return 'hidden';
    }
  };

  if (!type) return null;

  return (
    type && (
      <div
        className={`fixed inset-0 top-0 left-0 z-9999 flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.0.8)] p-2 `}
      >
        <div
          className={`flex max-h-[800px] lg:min-w-50 flex-col items-center justify-center gap-4 rounded-[15px] border p-2 px-4 text-lg font-bold ${getStyle(
            type
          )}`}
        >
          <button
            onClick={() => setInfo(null, null)}
            className='border-0.5 flex items-center justify-start self-end justify-self-start'
          >
            <X strokeWidth={4} size={10} />
          </button>
          <p>{message}</p>
        </div>
      </div>
    )
  );
};

export const useModalInfo = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default ModalContextProvider;
