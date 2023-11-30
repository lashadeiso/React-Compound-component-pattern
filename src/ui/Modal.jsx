import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import { useOutsideClick } from "../hooks/useOutsideClick";
import styled from "styled-components";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
  border: 1px solid var(--color-grey-300);
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

// -----------------------createPortal
// createPortal ის საშულებით შეგვიძლია მთლიანი JSX ფაილი გავხადოთ ნებისმიერი HTML ელემენტის შვილი
// მას პირველ არგუმენტად გადაეცემა ის კომპონენტი რაც უნდა დარენდერდეს,და მეორე არგუმენტად html ელემენტის ან კლასის სახელი
// ანუ ჩვენს შემთხვევაში modal ს ვარენდერებთ body ის შიგნით,მის შვილობილად და თუ ვნახავთ inspect ში დავრწმუნდებით
// ასევე შეგვიძლია ნებისმიერი კლასის შიგნით დავარენდეროთ მაგ: document.querySelector('კლასის სახელი')
// ეს იმიტომ არის კარგი და აუცილებელი რომ შემდგომში თავიდან ავირიდოთ CSS გადაფარვა,მაგალითად ჩვენი მოდალი
// რო რაღაცის შვილია და მას გავუწეროთ overflow:hidden და თუ მოდალი ზომებში გაცდება მშობელ ელემენტს
// შესაბამისად ჩამოიჭრება

// ----------------------cloneElement
// როგორც სახელიდან ინტუიციურად ვხვდებით მისი საშუალებით შეგვიძლია დავკლონოთ
// რაიმე ელემენტი,თუმცა მისი მთავარი ბენეფიტი არის ის რომ შეგვიძლია ამ ელემენტს დავუმატოთ
// რაიმე თვისება. პირველ ელემენტად მას გადაეცემა ის ელემენტი რასაც ვკლონავთ და მეორე არგუმენტად
// ის თვისება რისი დამატებაც გვინდა.
// მაგალითად განვიხილოთ Open ფუნქცია(კომპონენტი),თუ გადავალთ App.js ში ვნახავთ რომ აღნიშნულ
// კომპონენტს children ად გადაეცემა button ელემენტი,რომელიც პასუხისმგებელია მოდალის window -ს
// გახსნაზე,შესაბამისად რახან button იც კომპონენტად გვაქვს წარმოდგენილი და არა უბრალო html ელემენტად
// და თან გვინდა მისი აბსტრაქტულობა შევინარჩუნოთ და მისივე JSX ში არ გვქონდეს არანაირი სთეითი და
// ივენთი,აქვე მარტივად გავაკეთედ მისი კლონი და onClick ზე გადავეცით open ცვლადი.

// 1
const ModalContext = createContext();

// 2
function Modal({ children }) {
  const [openModalName, setOpenModalName] = useState("");
  const open = setOpenModalName; //აქ უბრალოდ setOpenModalName ს სახელი შევუცვალეთ
  const close = () => setOpenModalName("");

  return (
    <ModalContext.Provider value={{ openModalName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

// 3
function Open({ children, modalName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(modalName) });
}

function Window({ children, windowName }) {
  const { openModalName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close); // useOutsideClick ვიყენებთ იმისათვის რომ მოდალის გარეთ დაწკაპების დროს ფანჯარა დაიხუროს

  if (windowName !== openModalName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

// 4
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
