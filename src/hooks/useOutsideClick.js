import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }

      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}

// შეგახსენებთ რომ JS ში ივენთების ჰენდლინგი მოიცავს capturing და bubbling ის ფაზებს.
// capturing ფაზის დროს ივენთი ეშვება root ელემენტიდან target ელემენტისაკენ,ისე რომ
// თავად root ელემენტზე გავლენას არ ახდენს, ის ეგრევე მიემართება ქვემოთ სამიზნე ელემენტისაკენ.
// ანუ მისი მოგზაურობა Dom tree ში ხდება ზემოდან ქვემოთ.
// რაც შეეხება bubbling ის ფაზის დროს ივენთი მოგზაურობს target ელემენტიდან
// root ისაკენ,ანუ ქვემოდან ზემოთ.
// მისი გადაცემა ხდება addEventListener ში მესამე პარამეტრად რომელიც არის boolean
// ის ტიპის, თუ  true არის ე.ი. ვიყენებთ capturing ის ფაზას ხოლო თუ false არის
// ან საერთოდ არ არის ე.ი. ვიყენებთ bubbling ფაზას.
// ანუ ჩვენს შემთხვევაში როგორც ხედავთ ვიყენებთ capturing ის ფაზას,და ავხსნათ მიზეზი თუ
// რატომ ვიყენებთ მას.

// როდესაც დავაწვებით modal ის გახსნის ბათონს,ჩვენი მოდალის ფანჯარა ეგრევე ხდება body ელემენტის
// შვილი,როგორც ვიცით ამას ვაკეთებთ createPortal ის საშუალებით. ხოლო თუ inspect -ში შევიხედავთ
// ვნახავთ რომ body ელემენტს პირველ რიგში შვილად ჰყავს root ელემენტი.
// ანუ ჯერ არის root ელემენტი რომელიც მოიცავს მთელს ჩვენ html ფაილს ხოლო მის ქვემოთ გაჩნდება ჩვენი
// მოდალის window ელემენტი ანუ გამოდის რომ ბათონზე დაწკაპების დროს
// გვექნება body ის ორი შვილი ელემენტი root ი და ჩენი window  ელემენტი.
// რაც შეეხება ჩვენს  button-ს არის root ელემნტში შესაბამისად მასზე კლიკი ცხადია ნიშნავს window ელემენტის გარეთ
// დაკლიკებას,რაც იმას ნიშნავს რომ როგორც კი ფანჯარა გაიხსნება ავტომატურად useEffect ის საშუალებით
// გაეშვება მოდალის დამხურველი ფუნქციაც,რადგან სწორედ close ფუნქცია გადაეცემა ჩვენს useOutsideClick -ს.
// რაც თავის მხრივ მყისიერად გამოიწვევს მოდალის დახურვას ისე რომ ჩვენ ვერც კი შევამჩნევთ გაიხსნა თუ არა.
// სოწრედ ეს რომ არ მოხდეს ამიტომაც ვიყენებთ capturing ფაზას
