import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import StarsIcon from "@material-ui/icons/Stars";
import DoneIcon from "@material-ui/icons/Done";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import CardContent from "@material-ui/core/CardContent";
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import EditIcon from '@material-ui/icons/Edit';
import Collapse from "@material-ui/core/Collapse";
import {TextField} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
    root: {
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
    avatarComment: {
        borderRadius: '3%'
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
        marginTop: '5px',
        marginLeft: '15px',
    },
    content: {
        maxHeight: '250px',
        overflowY: 'auto'
    },
    edit: {
        width: '100%',
        '& label.Mui-focused': {
            color: '#1e1e1e',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#1e1e1e',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: '1px solid CF3F3B',
            },
            '&.Mui-focused fieldset': {
                border: '1px solid #1e1e1e',
            },
        }
    }
}));

export default function AlertDialog(props) {
    const [expanded, setExpanded] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    let stack = props.vacancy.Technologies ?
        props.vacancy.Technologies.split(' // ') : undefined;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <IconButton variant="outlined" color="primary" onClick={handleClickOpen}>
                <OpenInNewIcon />
            </IconButton>
            <Dialog maxWidth={"md"} fullWidth={true}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
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
                            </div>
                        }
                        title={props.vacancy.Position}
                        subheader={
                            <div>
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
                                            return <div className='tech-stack'>{el}</div>;
                                    }) : undefined}
                                </div>
                            </div>
                        }
                    />
                    <CardContent className={classes.content}>
                        <div dangerouslySetInnerHTML = {{__html:props.vacancy.Description}} />
                    </CardContent>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe" className={classes.avatarComment}>
                                <InsertCommentIcon />
                            </Avatar>
                        }
                        action={
                            <div className={classes.actions}>
                                <IconButton
                                    onClick={handleExpandClick}
                                            aria-expanded={expanded}
                                            aria-label="show more">
                                    <EditIcon />
                                </IconButton>
                            </div>
                        }
                        subheader={
                            <span>{props.vacancy.Comment !== null ? props.vacancy.Comment : 'comments'}</span>
                        }
                    />
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardHeader
                            action={
                                <div className={classes.actions}>
                                    <IconButton
                                        onClick={(e) =>
                                            props.changeComment(e, document.getElementById('comment').value)}>
                                        <SaveIcon />
                                    </IconButton>
                                </div>
                            }
                            subheader={
                                <span><TextField id='comment' className={classes.edit} label='Comments'
                                                 defaultValue={props.vacancy.Comment !== null ? props.vacancy.Comment : ''}/>
                                </span>
                            }
                        />
                    </Collapse>
                </Card>
            </Dialog>
        </div>
    );
}