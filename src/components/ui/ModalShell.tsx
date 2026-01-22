"use client";

import { motion } from "framer-motion";

type ModalShellProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export function ModalShell({ open, onClose, children }: ModalShellProps) {
    if (!open) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#050505] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
