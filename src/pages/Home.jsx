import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighLightText from "../components/core/HomePage/HighLightText";
import CTAButton from "../components/core/HomePage/CTAButton";
import bannerVideo from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
const Home = () => {
  return (
    <div className=" relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent">
      {/* section 1 */}
      <Link to={"/signup"}>
        <div className=" group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-semibold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
          <div className="flex flex-row items-center gap-2 rounded-full px-9 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
            <p>Become an Instructor</p>
            <FaArrowRight />
          </div>
        </div>
      </Link>

      <div className=" text-center text-3xl font-semibold mt-7">
        Empower Your Future with
        <HighLightText text={"Coding Skills"} />
      </div>

      <div className=" w-[75%] text-center text-base font-bold text-richblack-300 mt-4">
        With our online coding courses, you can learn at your own pace, from
        anywhere in the world, and get access to a wealth of resources,
        including hands-on projects, quizzes, and personalized feedback from
        instructors.
      </div>

      <div className="flex flex-row gap-7 mt-8">
        <CTAButton active={true} linkto={"/signup"}>
          Learn More
        </CTAButton>

        <CTAButton active={false} linkto={"/login"}>
          Book a Demo
        </CTAButton>
      </div>

      <div className="mx-4 my-12 shadow-blue-200 ">
        <video muted loop autoPlay>
          <source src={bannerVideo} type="video/mp4" />
        </video>
      </div>

      {/* code section 1 */}
      <div>
        <CodeBlocks
          position={"lg:flex-row"}
          heading={
            <div className="text-4xl font-semibold">
              Unlock Your
              <HighLightText text={"coding potential"} />
              {" "}with our online courses
            </div>
          }
          subheading={
            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
          }
          ctabtn1={{
            btnText: "try it yourself",
            linkto: "/signup",
            active: true,
          }}
          ctabtn2={{
            btnText: "learn more",
            linkto: "/login",
            active: false,
          }}

          codeblock={
            `<!DOCTYPE html>
            <html>
            <head>
            <title>Example</title>
            <linkrel="stylesheet"href="styles.css">
            </head>
            <body>
            <h1>
            <ahref="/">Header</a>
            </h1>
            <nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a></nav>`
          }
        />
      </div>
      {/* section 2 */}

      {/* section 3 */}

      {/* footer */}
    </div>
  );
};

export default Home;
