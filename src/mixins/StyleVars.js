export default {
  data: function() {
    return {
      stylevars: [
        {
          type: "color",
          name: "main-background",
          display: "Secondary",
          default: "black",
        },
        {
          type: "color",
          name: "primary",
          display: "Primary",
          default: "purple",
        },
        {
          type: "color",
          name: "background",
          display: "Background",
          default: "white",
        },
        {
          type: "color",
          name: "textdark",
          display: "Text Color (Dark)",
          default: "white",
        },
        {
          type: "color",
          name: "textlight",
          display: "Text Color (Light)",
          default: "black",
        },
        {
          type: "color",
          name: "shadow-color",
          display: "Shadow Color",
          default: "#00000033",
        },
        {
          type: "font",
          name: "font",
          display: "Font",
          default: "Titillium Web",
        },
        {
          type: "numeric",
          name: "shadow-depth",
          display: "Shadow Depth",
          default: "0",
        },
        {
          type: "numeric",
          name: "corners",
          display: "Rounded Corners",
          default: "10",
        },
      ],
    };
  },
};
