import { createPortal } from "react-dom";

type Props = {
    children: React.ReactNode;
};

export default function ModalPortal({ children }: Props) {
    const modalRoot = document.getElementById("modal-root");

    if (!modalRoot) return null;

    return createPortal(children, modalRoot);
}