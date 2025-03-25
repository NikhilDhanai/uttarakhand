import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function ChapterList() {
  const [hoveredImage, setHoveredImage] = useState(null);

  const chapters = [
    {
      name: "Uttarakhand Administrative Structure",
      image: "/images/admin.jpg",
    },
    {
      name: "Uttarakhand Physical Structure, Climate, and Natural Disasters",
      image: "/images/physical.jpg",
    },
    {
      name: "Uttarakhand Rivers and Lakes",
      image: "/images/river.jpg",
    },
    {
      name: "Uttarakhand Tradition of Valor, Sports, Awards, Etc.",
    },
    {
      name: "Uttarakhand: Science - Technology, Environment, and Ancient Measurement Systems",
    },
    {
      name: "Uttarakhand Prominent Personalities",
    },
    {
      name: "Uttarakhand Organizations, Institutions, and Museums",
    },
    {
      name: "Uttarakhand: Education, Language, Literature, Books",
    },
    {
      name: "Uttarakhand: Economic Scenario",
    },
    {
      name: "Uttarakhand: Welfare Schemes and Other Programs",
    },
    {
      name: "Uttarakhand: Energy Resources",
    },
    {
      name: "Uttarakhand: Transportation System",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Blur Effect */}
      <div className="absolute inset-0">
        {hoveredImage && (
          <motion.img
            key={hoveredImage}
            src={hoveredImage}
            alt="Chapter Preview"
            className="w-full h-full object-cover opacity-30 blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </div>

      {/* Chapter Selection */}
      <div className="relative z-10">
        <h1 className="text-5xl font-bold mb-16 tracking-wider">
          Select a Chapter
        </h1>
        <ul className="w-full max-w-lg">
          {chapters.map((chapter, index) => (
            <li key={index} className="mb-8">
              <Link
                to={`/chapter/${chapter.name}`}
                onMouseEnter={() => setHoveredImage(chapter.image || null)}
                onMouseLeave={() => setHoveredImage(null)}
                className="relative block text-2xl font-semibold text-white py-4 px-10 group transition-all duration-300 overflow-hidden"
              >
                {chapter.name}

                {/* Semi-Transparent Overlay for Visibility */}
                <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

                {/* Slanted Cut Effect with Image Only if Present */}
                {chapter.image && (
                  <motion.img
                    src={chapter.image}
                    alt="Chapter Thumbnail"
                    className="absolute right-0 top-0 h-full w-1/5 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      clipPath: "polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    }}
                  />
                )}

                {/* Refined Underline Effect */}
                <span className="absolute left-0 bottom-0 w-full h-[4px] bg-gradient-to-r from-transparent via-white to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChapterList;
