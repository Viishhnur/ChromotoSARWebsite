import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./components/Profile";
import SARColorizationPage from "./pages/SARColorizationPage";
import CropClassifyVGGPage from "./pages/CropClassifyVGGPage";
import FloodDetectionPage from "./pages/FloodDetectionPage";
import CropClassifyVitPage from "./pages/CropClassifyVitPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"}></Navigate>}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/home" element={<HomePage />}/>
          <Route path="/home/profile" element={<ProfilePage />} />
          <Route path="/home/sar-image-colorization" element={<SARColorizationPage />} />
          <Route path="/home/crop-classify-vgg16" element={<CropClassifyVGGPage />} />
          <Route path="/home/flood-detection" element={<FloodDetectionPage />} />
          <Route path="/home/crop-classification-vit" element={<CropClassifyVitPage />} />
      </Routes>
    </>
  );
}

export default App;
