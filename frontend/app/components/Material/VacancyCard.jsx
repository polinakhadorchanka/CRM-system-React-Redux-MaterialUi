import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import StarsIcon from '@material-ui/icons/Stars';
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: '7px',
        alignItems: 'center'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    date: {
        fontSize: '12px',
        marginRight: '10px',
    },
    info: {
        display: 'flex',
        flexDirection: 'row'
    },
    actions: {
        marginTop: '5px'
    }
}));

export default function RecipeReviewCard(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    let stack  = props.vacancy.Technologies ?
        props.vacancy.Technologies.split(' // ') : undefined;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {props.vacancy.IsViewed == 1 ? (props.vacancy.IsFavorite == 1 ? <StarsIcon/> : <DoneIcon/>) : ' '}
                    </Avatar>
                }
                action={
                    <div className={classes.actions}>
                        <span className={classes.date}>{props.vacancy.SiteAddingDate}</span>
                        <Button href={props.vacancy.Url} color="primary" target='_blank'>View</Button>
                        <IconButton aria-label="add to board">
                            <StarsIcon />
                        </IconButton>
                        <IconButton aria-label="remove">
                            <DeleteIcon />
                        </IconButton>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </div>
                }
                title={props.vacancy.Position}
                subheader={
                    <div className={classes.info}>
                        <a href={props.vacancy.Website} target='_blank'>
                            <span>
                                {props.vacancy.CompanyName}
                            </span>
                        </a>
                        <span>{props.vacancy.Country ? ' | ' + props.vacancy.Country : undefined}</span>
                        <span>{props.vacancy.Location ? ' | ' + props.vacancy.Location : undefined}</span>
                        <div className={stack ? 'stackDiv' : undefined}>
                            {stack ? stack.map(function (el, index) {
                                if(el !== '' && index <= 6)
                                    return <div className='tech-stack' style={index === 0 && props.vacancy.CompanyName
                                        ? {'margin-left': '10px'} : undefined} onClick={props.handleFilter}
                                                title={'Show vacancies for the selected technology'}
                                                id={el}>{el}</div>;
                            }) : undefined}
                        </div>
                    </div>
                }
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <div dangerouslySetInnerHTML = {{__html:props.vacancy.Description}} />
                </CardContent>
            </Collapse>
        </Card>
    );
}