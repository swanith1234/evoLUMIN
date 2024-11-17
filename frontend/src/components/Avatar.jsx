import React from "react";

// Define a color map based on letters
const colorMap = {
  A: "#f28b82",
  B: "#fbbc04",
  C: "#fff475",
  D: "#ccff90",
  E: "#a7ffeb",
  F: "#cbf0f8",
  G: "#aecbfa",
  H: "#d7aefb",
  I: "#fdcfe8",
  J: "#e6c9a8",
  K: "#f28b82",
  L: "#fbbc04",
  M: "#fff475",
  N: "#ccff90",
  O: "#a7ffeb",
  P: "#cbf0f8",
  Q: "#aecbfa",
  R: "#d7aefb",
  S: "#fc8",
  T: "#e6c9a8",
  U: "#f28b82",
  V: "#fbbc04",
  W: "#fff475",
  X: "#ccff90",
  Y: "#a7ffeb",
  Z: "#cbf0f8",
};

const Avatar = ({ name, width = 50, height = 50 }) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";
  const backgroundColor = colorMap[firstLetter] || "#007bff"; // Default color if not mapped

  return (
    <div
      style={{
        ...styles.avatar,
        backgroundColor,
        width: `${width}px`,
        height: `${height}px`,
        fontSize: `${Math.min(width, height) / 2}px`,
      }}
    >
      {firstLetter}
    </div>
  );
};

const styles = {
  avatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    color: "#fff",
    borderRadius: "50%",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
};

export default Avatar;
