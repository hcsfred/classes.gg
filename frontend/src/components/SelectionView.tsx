import React from "react";
import Slider from "react-slick";
import PlayerCard from "./PlayerCard";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Player } from "../domain/player";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface IProps {
    classes: any
    players: Array<Player>
    selectPlayer: (username: string) => void
}

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
        backgroundColor: theme.palette.background.paper,
    }
}));

function getSlidesForWidth(width: number) {
    if (width <= 600) {
        return 1
    } else if (width <= 960) {
        return 3
    } else if (width <= 1280) {
        return 4
    }
    return 5;
}

const sliderSettings = {
    slidesToShow: 5,
    pauseOnHover: false,
    swipe: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 100,
    speed: 2000,
    responsive: [
        {
            breakpoint: 1280, // md
            settings: {
                slidesToShow: getSlidesForWidth(1280),
            }
        },
        {
            breakpoint: 960, // sm
            settings: {
                slidesToShow: getSlidesForWidth(960),
            }
        },
        {
            breakpoint: 600, // xs
            settings: {
                slidesToShow: getSlidesForWidth(600),
                //arrows: true, TODO: impl
                swipe: true,
                swipeToSlide: true,
                autoplay: false,
                speed: 0,
            }
        }
    ]
};

class SelectionView extends React.Component<IProps> {

    render() {
        const { classes, players } = this.props

        const isCarousel = players.length > getSlidesForWidth(window.innerWidth) // Sliding required

        const cards = players.map((player) => (
            <div key={player.username}>
                <PlayerCard
                    username={player.username}
                    avatar={player.avatar}
                    selectPlayer={this.props.selectPlayer}
                />
            </div>
        ))

        return isCarousel ? (
            <Slider className={classes.container} {...sliderSettings}>
                {cards}
            </Slider>
        ) : (
            <div className={classes.container}>
                <Grid container>
                    {cards.map((card, index) => (
                        <Grid item xs key={index}>
                            {card}
                        </Grid>
                    ))}
                </Grid>
            </div>
        )
    }
}

export default (props: any) => {
    const classes = useStyles()
    return <SelectionView
        classes={classes}
        players={props.players}
        selectPlayer={props.selectPlayer}
    />
}