import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import CertificatesPage from "./pages/CertificatesPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import PostPage from "./pages/PostPage.jsx";
import PostEditorPage from "./pages/PostEditorPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/new" element={<PostEditorPage />} />
        <Route path="blog/:slug/edit" element={<PostEditorPage />} />
        <Route path="blog/:slug" element={<PostPage />} />
      </Route>
    </Routes>
  );
}
