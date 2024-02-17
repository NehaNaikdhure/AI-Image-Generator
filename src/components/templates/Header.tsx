import { Container, Stack, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { SettingContext } from '../../context/SettingsContext'
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ToggleButton from "@mui/material/ToggleButton";
import ColorLensIcon from "@mui/icons-material/ColorLens";

type Props = {}

function Header({ }: Props) {
    const { settings, changeThemeScheme, toggleTheme } = useContext(SettingContext)
    return (
        <div>
            <Container sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
            }}>
                <Typography variant={settings.screen === "mobile" ? "h6" : "h4"}>
                    AI Image Generator
                </Typography>
                <Stack direction={'row'} spacing={2}>
                    <ToggleButton
                        style={{ borderRadius: "50px", border: "none" }}
                        value="check"
                        onChange={toggleTheme}
                    >
                        {settings.themeMode === "dark" && <LightModeIcon color={"secondary"} />}
                        {settings.themeMode === "light" && <DarkModeIcon color={"secondary"} />}
                    </ToggleButton>
                    <ToggleButton
                        value={"check"}
                        style={{ borderRadius: "50px", border: "none" }}
                        onChange={changeThemeScheme}
                    >
                        <ColorLensIcon color={"secondary"} />
                    </ToggleButton>
                </Stack>
            </Container>
        </div>
    )
}

export default Header