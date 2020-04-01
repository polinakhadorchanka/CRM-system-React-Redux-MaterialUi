import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";
import DoneIcon from '@material-ui/icons/Done';
import MaterialMenu from "./MaterialMenu.jsx";
import StarsIcon from '@material-ui/icons/Stars';
import Dialog from "./ConfirmDialog.jsx";

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
    },
    content: {
        maxHeight: '250px',
        overflowY: 'auto'
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
                        {props.vacancy.BoardStatus !== null ? <StarsIcon/> :
                            (props.vacancy.IsViewed == 1 ? <DoneIcon/> : ' ')}
                    </Avatar>
                }
                action={
                    <div className={classes.actions}>
                        <span className={classes.date}>{props.vacancy.SiteAddingDate}</span>
                        <Button href={props.vacancy.Url} color="primary" target='_blank'>View</Button>
                        <MaterialMenu values={['new', 'in the process', 'completed', 'deferred']}
                                      handleChooseStatus={props.handleChooseStatus}
                        />
                        <Dialog handleRemove={props.handleRemoveVacancy}/>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={(e) => props.handleOpenDesc(e, handleExpandClick)}
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
                <CardContent className={classes.content}>
                    <div dangerouslySetInnerHTML = {{__html:props.vacancy.Description}} />
                </CardContent>
            </Collapse>
        </Card>
    );
}