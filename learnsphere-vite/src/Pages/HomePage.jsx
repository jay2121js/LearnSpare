import Hero from "../components/Hero.jsx";
import PlatformFeatures from "../components/HomePageComponent/PlatformFeatures.jsx";
import TopEducators from "../components/HomePageComponent/TopEducators.jsx";
import ListCourses from "../Services/ListCourses.jsx";
import courseService from "../Services/courseService.jsx";
import CourseForm from "../components/CourseForm.jsx";
const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-900 text-white">
      <Hero />
      <ListCourses />
      <TopEducators />
      <PlatformFeatures />
    </div>
  );
};

export default HomePage;