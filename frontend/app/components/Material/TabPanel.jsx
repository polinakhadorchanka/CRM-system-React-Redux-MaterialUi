import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import VacancyList from "../VacancyList.jsx";
import Board from "../Board.jsx";
import ParsersTable from "../ParsersTable.jsx";
import FilterInput from "../FilterInput.jsx";
import UpdateIcon from '@material-ui/icons/Update';
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: 'transparent',
        minWidth: '1200px'
    },
    bar: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        padding: '0 20px',
    },
    tab: {
        color: '#e1e1e1',
        opacity: '1',
    },
    indicator: {
        background: '#e1e1e1'
    }
}));

export default function SimpleTabs(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.bar}>
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" classes={{indicator: classes.indicator}} >
                    <Tab className={classes.tab} label="All" {...a11yProps(0)} onClick={() => props.setNextCount(true, 'all')}/>
                    <Tab className={classes.tab} label="Unviewed" {...a11yProps(1)} onClick={() => props.setNextCount(true, 'unviewed')}/>
                    <Tab className={classes.tab} label="Board" {...a11yProps(2)} onClick={props.handleClick}/>
                    <Tab className={classes.tab} label="Parsers" {...a11yProps(3)} onClick={props.handleClick}/>
                    {((document.getElementById('simple-tab-2') &&
                        document.getElementById('simple-tab-2').getAttribute('aria-selected') === 'true') ||
                    (document.getElementById('simple-tab-3') &&
                    document.getElementById('simple-tab-3').getAttribute('aria-selected') === 'true')) ? undefined : <FilterInput/>}
                    <IconButton id='update-button' onClick={props.handleClick}
                                style={((document.getElementById('simple-tab-2') &&
                                    document.getElementById('simple-tab-2').getAttribute('aria-selected') === 'true') ||
                                    (document.getElementById('simple-tab-3') &&
                                        document.getElementById('simple-tab-3').getAttribute('aria-selected') === 'true')) ?
                                    {marginLeft: 'auto'} : undefined} >
                        <UpdateIcon style={{'color':'#e1e1e1'}}/>
                    </IconButton>
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <VacancyList filter='all'/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <VacancyList filter='unviewed'/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Board/>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <ParsersTable/>
            </TabPanel>
        </div>
    );
}