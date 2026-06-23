import React from "react";
import { Box, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

interface EmptyStateProps {
  onAddProject: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddProject }) => (
  <Box
    id="empty-state"
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "45vh",
      textAlign: "center",
      py: 8,
    }}
  >
    <Box
      sx={{
        width: 100,
        height: 100,
        borderRadius: "24px",
        background:
          "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))",
        border: "1px solid rgba(124,58,237,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 3,
        animation: "float 3s ease-in-out infinite",
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      }}
    >
      <RocketLaunchIcon sx={{ fontSize: 48, color: "primary.main" }} />
    </Box>

    <Typography
      variant="h4"
      sx={{
        fontWeight: 800,
        mb: 1.5,
        background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      No projects yet
    </Typography>

    <Typography
      variant="body1"
      color="text.secondary"
      sx={{ mb: 4, maxWidth: 380, lineHeight: 1.7 }}
    >
      Your workspace is ready. Create your first project to start building
      amazing UI applications.
    </Typography>

    <Fab
      id="empty-state-add-btn"
      variant="extended"
      onClick={onAddProject}
      sx={{ px: 4, gap: 1 }}
    >
      <AddIcon />
      Create First Project
    </Fab>
  </Box>
);

export default EmptyState;
