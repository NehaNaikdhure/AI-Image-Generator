import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Checkbox,
    CircularProgress,
    MenuItem,
    Slider,
    Switch,
    TextField,
    TextFieldProps,
    Typography,
    styled,
    useTheme,
} from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack"; import { UserContext } from "../../context/UserContext"
import React, { useContext, useEffect, useState } from 'react'
import { SettingContext } from '../../context/SettingsContext'
import { Helmet } from 'react-helmet-async'
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ToggleButton from "@mui/material/ToggleButton";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { FadingContentLoader } from '../../components/loaders/ContentLoaders';
import { toast } from "react-toastify";
import { openAIConfigs } from "../../config.environment";
import { Container } from '@mui/material';
import { getLimitValue, setLimitValue } from "../../services/LocalStorage/LocalLimitTracker";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { MachineLoader } from "../../components/loaders/SiteLoader";
import SpinnerLoader from "../../components/loaders";
import GetAppIcon from '@mui/icons-material/GetApp';
type Props = {}
const MAX_IMAGE_COUNT = 3
const OPEN_AI_API_KEY = openAIConfigs.apiKey
function Home({ }: Props) {
    const { settings } = useContext(SettingContext)
    const [images, setImages] = React.useState<string[]>([
        "",
        "",
        "",
    ])
    const [currentLimit, setCurrentLimit] = React.useState<number>(getLimitValue('image-count'))
    const [input, setInput] = React.useState<string>("")
    const [loading, setLoading] = React.useState<boolean>(false)
    const [currentImagesCount, setCurrentImagesCount] = useState<number>(1)
    async function generateImages() {
        setLoading(true)
        try {
            console.log("Generating images");
            console.log(OPEN_AI_API_KEY);
            const currentLimitValue = getLimitValue('image-count')
            if (currentLimitValue >= MAX_IMAGE_COUNT) {
                toast.error("You have reached the limit of generating images")
                setLoading(false)
                return
            } else {
                setLimitValue('image-count', currentLimitValue + 1)
                setCurrentLimit(currentLimitValue + 1)
            }
            setCurrentLimit(currentLimitValue + 1)
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPEN_AI_API_KEY}`
                },
                body: JSON.stringify({
                    prompt: input,
                    n: currentImagesCount,
                    size: "256x256",
                    response_format: "b64_json"

                })
            })
            const data = await response.json()
            console.log(data)
            setImages([...data.data])
            let temp = [] as string[]
            for (let i = 0; i < data.data.length; i++) {
                temp.push("data:image/jpeg;base64,"+data.data[i].b64_json)
            }
            for (let i = data.data.length - 1; i < 3; i++) {
                temp.push("")
            }
            setImages(temp)
            setLoading(false)
            toast.success("Images generated successfully")
        }
        catch (error) {
            console.error(error)
            toast.error("Error generating images")
            setLoading(false)
        }
    }

    return (
        <div>
            <div style={{
                height: "100vh",
                padding: "20px 2px"
            }}>
                <Container style={{
                    // border:"1px solid #e0e0e0",
                }} >
                    <Card style={{
                        padding: "1rem",
                        marginBottom: "1rem",
                        width: "100%",
                    }}>
                        <Typography variant={"h4"} textAlign={"center"} style={{ marginBottom: "1rem" }}>
                            AI Image Generator
                        </Typography>
                        <Typography variant={"body1"} textAlign={"center"} style={{ marginBottom: "1rem" }}>
                            This is a simple AI image generator that uses AI Model to generate images based on a given input
                        </Typography>

                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "1rem",
                        }}>
                            <CardMedia
                                component="img"
                                image="/images/text-format.png"
                                alt="random"
                                style={{
                                    maxWidth: "100px",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    marginBottom: "1rem",
                                }} />
                            <ArrowRightAltIcon style={{ fontSize: "3rem", }} />
                            <CardMedia
                                component="img"
                                image="/images/picture.png"
                                alt="random"
                                style={{
                                    maxWidth: "100px",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    marginBottom: "1rem",
                                }} />
                        </div>

                        <Typography variant={"body2"} textAlign={"center"} style={{ marginBottom: "1rem", color: "gray" }}>
                            You can use this system upto {MAX_IMAGE_COUNT - currentLimit} times
                        </Typography>
                        <form onSubmit={(event) => {
                            event.preventDefault()
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: settings.screen === "mobile" ? "column" : "row"
                            }}>

                                <TextField
                                    size="small"
                                    variant="outlined"
                                    label="Enter Text"
                                    style={{ marginBottom: "1rem" }}
                                    fullWidth
                                    value={input}
                                    onChange={(event) => {
                                        setInput(event.target.value)
                                    }}
                                    placeholder="Enter anything to generate images"
                                />
                                <TextField
                                    select
                                    size="small"
                                    variant="outlined"
                                    label="Images Count"
                                    style={{ marginBottom: "1rem" }}
                                    value={currentImagesCount}
                                    onChange={(event) => {
                                        setCurrentImagesCount(parseInt(event.target.value))
                                    }}
                                    sx={{
                                        width: "100%",
                                        maxWidth: "200px"
                                    }}
                                >
                                    <MenuItem value="1">1</MenuItem>
                                    <MenuItem value="2">2</MenuItem>
                                    <MenuItem value="3">3</MenuItem>
                                </TextField>
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "end",
                            }}>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={generateImages}
                                    disabled={loading || input.length === 0 || currentLimit >= MAX_IMAGE_COUNT}
                                >
                                    Generate Images
                                </Button>
                            </div>
                        </form>
                    </Card>
                </Container>
                <Container style={{
                }}>
                    <Typography variant={"h5"} style={{ marginBottom: "1rem" }}>
                        Generated Images
                    </Typography>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        flexWrap: "wrap",
                    }}>
                        {images.map((image, index) => {
                            if (index < currentImagesCount)
                                return (
                                    <ImageCard key={index} image={image} loading={loading} />
                                )
                        })}
                    </div>

                </Container>

            </div>
            {
                loading && < div style={{
                    position: "fixed",
                    bottom: "0",
                    left: "0",
                    width: "100%",
                    height: "100vh",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                }}>
                    <MachineLoader />
                </div>
            }
        </div >
    )
}



function ImageCard({ image, loading }: { image: string, loading: boolean }) {
    return (
        <Card style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "200px",
            minHeight: "200px",
            margin: "1rem",
            position: "relative",
        }}>

            {
                loading ? <>
                    <SpinnerLoader />

                </> : <>
                    {
                        image.length === 0 ? <CardMedia
                            component="img"
                            image="https://blog.springworks.in/wp-content/themes/fox/images/placeholder.jpg"
                            alt="random"
                            style={{
                                maxWidth: "200px",
                                minWidth: "200px",
                                minHeight: "200px",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                            :
                            <>
                                <CardMedia
                                    component="img"
                                    image={image}
                                    alt="random"
                                    style={{
                                        maxWidth: "400px",
                                        minWidth: "200px",
                                        minHeight: "200px",
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                                <a href={image}id="download" download={"image.jpg"} style={{
                                    position: "absolute",
                                    bottom: "10px",
                                    right: "10px",
                                }} target="_blank" rel="noopener noreferrer">

                                    <Button size="small" sx={{
                                        position: "absolute",
                                        bottom: "10px",
                                        right: "10px",
                                    }}>
                                        <GetAppIcon />
                                    </Button>
                                </a>
                            </>
                    }
                </>
            }
        </Card>
    )
}



export default Home