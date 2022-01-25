import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import ReactDOM from "react-dom";
import "./index.css";

class ClassComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      age: 0,
      count: 0,
      films: ["film 1"],
      test: {
        count: 0,
        age: "from test",
      },
    };

    console.log("constructor");
  }

  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps", props, state);

    // вычисление
    return {
      test2: props,
    };
  }

  // state = {
  //   age: 12,
  //   count: 0,
  //   films: ["film 1"],
  //   test: {
  //     count: 0,
  //     age: "from test",
  //   },
  // };

  increment = () => {
    // this.state.age = "new"; // Не делать мутации
    // this.setState(updater, ?cb)
    // updater = {} / () => ({})
    ///
    this.setState({
      count: this.state.count + 1, // 0 + 1
    });
    // this.setState({
    //   count: this.state.count + 10, // 0 + 10
    // });
    // this.setState({
    //   count: this.state.count + 100, // 0 + 100
    // });
    ////
    // this.setState((state) => ({
    //   count: state.count + 1,
    // }));
    // this.setState((state) => ({
    //   count: state.count + 10,
    // }));
    // this.setState((state) => ({
    //   count: state.count + 100,
    // }));
    ///
    // setTimeout(() => {
    //   this.setState({
    //     count: this.state.count + 1,
    //   });
    //   this.setState({
    //     count: this.state.count + 10,
    //   });
    //   this.setState({
    //     count: this.state.count + 100,
    //   });
    // });
  };

  decrement = () => {
    this.setState({
      count: this.state.count - 1,
    });
  };

  addFilm = () => {
    this.setState({
      films: [...this.state.films, `film ${Math.random().toFixed(5)}`],
    });
  };

  removeFilm = (filmName) => {
    this.setState({
      films: this.state.films.filter((film) => film !== filmName),
    });
  };

  incrementTestCount = () => {
    this.setState({
      test: {
        ...this.state.test,
        count: this.state.test.count + 1,
      },
    });
  };

  listener = () => {
    console.log("click");
  };

  componentDidMount() {
    document.addEventListener("click", this.listener);
    //синхронный
    console.log("componentDidMount");
    // побочные эффекты
    // подписки
    // таймеры
    // запросы
    // работа с ДОМ
    // setState

    this.decrement();

    setTimeout(() => {
      this.decrement();
    }, 500);
    // setInterval(() => {
    //   this.decrement();
    // }, 500);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate");

    if (nextState.count > 10) {
      return false;
    }

    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("getSnapshotBeforeUpdate");

    const scrollHeight = 100;

    return scrollHeight;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("componentDidUpdate", snapshot);

    if (prevState.count === -3) {
      this.decrement();
    }

    //синхронный
    // побочные эффекты
    // подписки
    // таймеры
    // запросы
    // работа с ДОМ
    // setState
  }

  componentWillUnmount() {
    // отписки
    // очистки таймеров
    // очистки ивентов
    console.log("componentWillUnmount");

    document.removeEventListener("click", this.listener);
  }

  render() {
    console.log("render", this.state, this.props);
    const { age, count, films, test } = this.state;

    return (
      <div>
        <h1>Hello class component {age}</h1>
        <h1>count {count}</h1>
        <button onClick={this.increment}>increment</button>
        <button onClick={this.decrement}>decrement</button>

        <hr />
        <h2>films</h2>
        <button onClick={this.addFilm}>add film</button>
        {films.map((film) => (
          <div>
            <h3>{film}</h3>
            <button onClick={() => this.removeFilm(film)}>X</button>
          </div>
        ))}

        <hr />

        <h1>{test.count}</h1>
        <h1>{test.age}</h1>

        <button onClick={this.incrementTestCount}>increment test count</button>
      </div>
    );
  }
}

// const listener = () => {
//   console.log("click");
// };

const FunctionComponent = () => {
  const [count, setCount] = useState(0);
  const [films, setFilms] = useState(["film 1"]);
  const [messages, setMessages] = useState([]);
  // const [message, setMessage] = useState("");

  const listener = useCallback(() => {
    console.log("click");
  }, []);
  // const listener = () => {
  //   console.log("click");
  // };

  const result = useMemo(() => {
    // 500ms
    return 1 + 1;
  }, []);

  console.log("result", result);

  useEffect(() => {
    console.log("useEffect: !componentDidMount!");

    document.addEventListener("click", listener);

    return () => {
      console.log("useEffect: !componentWillUnmount! remove DOM");
      document.removeEventListener("click", listener);
    };
  }, [listener]);

  useLayoutEffect(() => {
    console.log("useLayoutEffect: !componentDidMount!");

    return () => {
      console.log("useLayoutEffect: !componentWillUnmount! remove DOM");
    };
  }, []);

  useEffect(() => {
    console.log("useEffect: !componentDIdUpdate!");

    return () => {
      console.log("useEffect: !componentWillUnmount!");
    };
  }, [count]);

  const addFilm = () => {
    setFilms([...films, `film ${Math.random().toFixed(5)}`]);
    // setFilms((state) => [...state, `film 2`]);
    // setFilms((state) => [...state, `film 3`]);
  };

  const sendMessage = useCallback((author = "User", msg) => {
    setMessages((messages) => [
      ...messages,
      { author: author ?? "Bot", message: msg },
    ]);
  }, []);

  const removeFilm = (filmName) => {
    setFilms(films.filter((film) => film !== filmName));
  };

  useEffect(() => {
    if (messages.length && messages[messages.length - 1]?.author === "User") {
      sendMessage("Bot", "from Bot");
    }
  }, [messages, sendMessage]);

  console.log("render", messages);

  return (
    <div>
      <h1>Function</h1>
      <h2>Count {count}</h2>
      {/* <button onClick={() => setCount(count + 1)}>increment</button> */}
      <button onClick={() => setCount((state) => state + 1)}>increment</button>
      <button onClick={() => sendMessage("User", "Test")}>sendMessage</button>
      <button onClick={() => setCount(count - 1)}>decrement</button>

      <hr />
      <h2>films</h2>
      <button onClick={addFilm}>add film</button>
      {films.map((film) => (
        <div>
          <h3>{film}</h3>
          <button onClick={() => removeFilm(film)}>X</button>
        </div>
      ))}

      <hr />

      {/* <Component listener={listener} /> */}
    </div>
  );
};

const App = () => {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setVisible(!visible)}>setVisible</button>
      {/* {visible && <ClassComponent testProps="test" />} */}
      {visible && <FunctionComponent testProps="test" />}
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
