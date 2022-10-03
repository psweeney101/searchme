import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import { GMChatType } from 'src/interfaces';
import { About, Callback, Chat, Home, Login, Logout } from 'src/pages';
import { RouterScroll } from 'src/components';
import { App } from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <RouterScroll>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/dm/:id" element={<Chat type={GMChatType.DM} />} />
          <Route path="/group/:id" element={<Chat type={GMChatType.Group} />} />
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/callback" element={<Callback />}></Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </RouterScroll>
  </BrowserRouter>
);
