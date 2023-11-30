Compound component pattern პატერნის საშუალებით შეგვიძლია შევქმნათ რამოდენიმე კომპონენტი რომლებიც 
იქნება დაკავშირებული ერთ დიდ super კომპონენტთან. უფრო მარტივად რომ წარმოვიდგინოთ,ჯერ ვქმნით 
მშობელ კომპონენტს და მას შემდეგ ვანაწევრებთ სხვადასხვა პატარ-პატარა კომპონენტებად.თუმცა მათ 
გამოყენებას აზრი აქვს მშობელ კომპონენტთან ერთად, მისი კარგი მაგალითია html ში select და option ელემენტები.

მაგალითად drop down ისთვის როდესაც ვქნით:
<select>
  <option>1</option>
  <option>2</option>
  <option>3</option>
</select>
 
ეხლა კი განვიხილოთ compound component pattern ის მაგალითი:

function Counter() {                         გვაქვს Counter კომპონენტი
  return <span>Counter</span>;
}

export default Counter;




import Counter from "./Counter";

export default function App() {
  return (
    <div>
      <h1>Compound Component Pattern</h1>
      <Counter/>                            რომელსაც ვიძახებთ App კომპონენტში და ვარენდერებთ მას
    </div>
  );
}

წარმოვიდგინოთ რომ Counter კომპონენტი არის,ზემოთ ხსენებული super,ანუ მშობელი კომპონენტი.
ეხლა კი დავწეროთ კოდი და განვმარტოთ თითოეული დეტალი:

import { createContext, useContext, useState } from "react";

                                                     
// 1. Create a context                              როგორც ვიცით,აღნიშნული კომპონენტი უნდა დავანაწევროთ პატარ-პატარა კომპონენტებად,
const CounterContext = createContext();             იმისათვის რომ მისი state ხელმისაწვდომი იყოს ყველა დანაწევრებული კომპონენტისთვის
                                                    ამისათვის იდიალური საშულება არის context ის გამოყენება.ამიტომაც პირველ რიგში 
                                                    შევქმენით ის.


// 2. Create parent component                             შევქმენით საკვანძო ობიექტი,რომელსაც აქვს state და აღნიშნულ state ზე მანიპულრიების
function Counter({ children }) {                          ორი ფუნქცია,შესაბამისად საჭიროა მათი გატანა context ში,და provider ის საშულებით
  const [count, setCount] = useState(0);                  გადავცემთ დანაწევრებულ კომპონენტებს
  const increase = () => setCount((c) => c + 1);
  const decrease = () => setCount((c) => c - 1);

  return (
    <CounterContext.Provider value={{ count, increase, decrease }}>
      <span>{children}</span>
    </CounterContext.Provider>
  );
}

// 3. Create child components to help implementing the common task      მსწორედ ეს ფუნქციები არის დანაწევრებული კომპონენტები,რომელთა გამოძახებაც შეგვიძლია
function Count() {                                                      ერთმანეთის დამოუკიდებლად,რამდნჯერაც გვინდა და რა თანმიმდევრობითაც გვინდა.
  const { count } = useContext(CounterContext);                        
  return <span>{count}</span>;
}

function Label({ children }) {
  return <span>{children}</span>;
}

function Increase({ icon }) {
  const { increase } = useContext(CounterContext);
  return <button onClick={increase}>{icon}</button>;
}

function Decrease({ icon }) {
  const { decrease } = useContext(CounterContext);
  return <button onClick={decrease}>{icon}</button>;
}
// 4. Add child components as proeprties to parent component           აქ კი ვამატებთ იმ დანაწევრებულ კომპონენტებს როგორც მშობელი კომპონენტის ფროფერთიები
Counter.Count = Count;                                                 ანუ მაგალითად Counter.Count ეგრე დეფაულტად არ არსებობს თუ კი ის არ შევქმენით
Counter.Label = Label;                                                 რაც იმას ნიშნავს რომ ის უნდა გავუტოლოდ რამეს,ჩვენს შემთხვევაში Count ფუნქციას(კომპონენტს)
Counter.Increase = Increase;
Counter.Decrease = Decrease;

export default Counter;



ეხლა კი დროა ვნახოთ მისი გამოყენების მაგალით App კომპონენტში:

import Counter from "./Counter";

export default function App() {
  return (

    <div>                                                                     პირველი გამოძახება
      <h1>Compound Component Pattern</h1>                                        
        <Counter>
         <Counter.Label>My super flexible counter</Counter.Label>
         <Counter.Decrease icon="-" />
         <Counter.Increase icon="+" />
         <Counter.Count />
      </Counter>
    </div>

      <div>                                                                   მეორე გამოძახება
        <Counter>
          <Counter.Decrease icon="◀️" />
          <div>
            <Counter.Count />
          </div>
          <Counter.Increase icon="▶️" />
        </Counter>
      </div>


  );
}

როგორც ხედავთ 2 ადგილას გამოვიძახეთ ჩვენი Counter კომპონენტის შვილობილი კომპონენტები,
რომელთაც თითოეულს გადავცემთ სხვადასხვა მნიშვნელობებს მაგალითად თუ კი Counter.Decrease
კომპონენტს პირველად icon ად "-" გადავეცი,მეორე გამოძახების დროს "◀️" გადავეცით.
ასევე ეს კომპონენტები სხვადასხვა თანმიმდევრობით გამოვიძახეთ. მოკლედ,დავყავით და ვიბატონეთ..
