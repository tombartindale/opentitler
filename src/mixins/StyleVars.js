export default {
  data: function() {
    return {
      stylevars: [
        {
          type: "color",
          name: "main-background",
          display: "Background",
          default: "black",
        },
        {
          type: "color",
          name: "primary",
          display: "Foreground",
          default: "purple",
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
      ],
    };
  },
};
