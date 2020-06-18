import React from "react";
import Api from "./api";
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router";
import { Player } from "./player";

interface IProps {
    username: string
    classes: any
}

interface IState {
    player: Player | null
    selectedWeapon: string
}

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(8),
        marginLeft: theme.spacing(8),
        marginBottom: theme.spacing(8),
    },
    title: {
        paddingTop: 8,
        fontFamily: 'Bebas Neue',
        fontSize: '2.25rem',
    },
    firstRow: {
        height: 75,
    },
    secondRow: {
        height: 300,
    },
    avatar: {
        borderRadius: '2%',
    },
    formControl: {
        minWidth: '20%',
    },
    list: {
        padding: 0,
    },
    attachment: {
        borderRadius: 5,
        backgroundColor: theme.palette.background.paper,
        marginBottom: theme.spacing(1.9),
        maxWidth: '60%',
        maxHeight: 50,
    },
}));

class PlayerView extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            player: null,
            selectedWeapon: ""
        }
    }

    async getPlayer() {
        const player = await Api.getPlayer(this.props.username)
        this.setState({
            player,
            selectedWeapon: Object.keys(player.weapons)[0]
        })
    }

    componentDidMount() {
        this.getPlayer().catch(err => console.log(err))
    }

    onSelectWeapon = (event: any) => {
        this.setState({selectedWeapon: event.target.value})
    };

    render() {
        const player = this.state.player

        if (player == null) {
            return null
        }

        const classes = this.props.classes
        const weapon = this.state.selectedWeapon
        const attachments = Object.values(player.weapons[this.state.selectedWeapon])

        return (
            <div className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3} container direction="column">
                        <Grid item className={classes.firstRow}>
                            <Typography className={classes.title} variant="h4">
                                {player.username}
                            </Typography>
                        </Grid>
                        <Grid item className={classes.secondRow}>
                            <img className={classes.avatar} src={player.avatar} alt={"Avatar"} />
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={9} container direction="column">
                        <Grid item className={classes.firstRow}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="loadout-select-label">Loadout</InputLabel>
                                <Select
                                    id="loadout-select"
                                    labelId="loadout-select-label"
                                    label="Loadout"
                                    value={weapon}
                                    onChange={this.onSelectWeapon}
                                >
                                    {Object.keys(player.weapons).map((weapon) =>
                                        <MenuItem key={weapon} value={weapon}>{weapon}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item className={classes.secondRow}>
                            <List classes={{ root: classes.list }}>
                                {attachments.map((attachment, index) =>
                                    <ListItem key={index} className={classes.attachment}>
                                        <ListItemText primary={attachment} />
                                    </ListItem>
                                )}
                            </List>
                        </Grid>
                     </Grid>

                </Grid>
            </div>
        );
    }
}

export default () => {
    const { username } = useParams();
    const classes = useStyles()
    return <PlayerView username={username} classes={classes} />
}