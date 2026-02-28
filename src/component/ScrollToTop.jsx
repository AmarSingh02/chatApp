import { useEffect, useState } from "react";
  import { TiArrowUpOutline } from "react-icons/ti";
export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const messagesContainer = document.querySelector(".messages");
    if (!messagesContainer) return;

    const onScroll = () => {
      setShow(messagesContainer.scrollTop > 150);
    };

    messagesContainer.addEventListener("scroll", onScroll);
    return () => messagesContainer.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const messagesContainer = document.querySelector(".messages");
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (!show) return null;

  return (
    <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
    
<TiArrowUpOutline/>
    </button>
  );
}