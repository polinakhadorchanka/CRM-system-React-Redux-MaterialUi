import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Paper from '@material-ui/core/Paper';
import ConfirmDialog from "./ConfirmDialog.jsx";
import Check from "./Check.jsx";
import ParserTextField from "./ParserTextField.jsx";
import IconButton from "@material-ui/core/IconButton";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#000',
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 1000,
    },
});

export default function CustomizedTables(props) {
    const classes = useStyles();
    return (
        <div>
            <form onSubmit={props.handleSubmit} id='form'/>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">IP Key</StyledTableCell>
                            <StyledTableCell align="center">IP Token</StyledTableCell>
                            <StyledTableCell align="center">Description</StyledTableCell>
                            <StyledTableCell align="center">Status</StyledTableCell>
                            <StyledTableCell align="center">Last date</StyledTableCell>
                            <StyledTableCell align="center">Run</StyledTableCell>
                            <StyledTableCell align="center"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.parsers.map((parser) => (
                            <StyledTableRow key={parser.ParserId}>
                                <StyledTableCell>{parser.ParserKey}</StyledTableCell>
                                <StyledTableCell>{parser.ParserToken}</StyledTableCell>
                                <StyledTableCell>{parser.ParserDescription}</StyledTableCell>
                                <StyledTableCell>{parser.ParserStatus}</StyledTableCell>
                                <StyledTableCell>{parser.ParserLastDate}</StyledTableCell>
                                <StyledTableCell><Check checked={parser.ParserState == true} handleChange={props.handleChangeCheck} parserId={parser.ParserId}/></StyledTableCell>
                                <StyledTableCell><ConfirmDialog handleRemove={props.handleRemove} parserId={parser.ParserId}/></StyledTableCell>
                            </StyledTableRow>
                        ))}
                        <StyledTableRow key='form'>
                            <StyledTableCell>
                                <ParserTextField label='IP Key' id='ipKey' maxLength='12' required={true}
                                                 error={props.errors.filter((el) => el.errorCode === -1).length > 0}
                                                 form='form'/>
                            </StyledTableCell>
                            <StyledTableCell>
                                <ParserTextField label='IP Token' id='ipToken' maxLength='12' required={true}
                                                 error={props.errors.filter((el) => el.errorCode === -2).length > 0}
                                                 form='form'/>
                            </StyledTableCell>
                            <StyledTableCell>
                                <ParserTextField label='Description' id='description' required={true}
                                                 error={props.errors.filter((el) => el.errorCode === -3).length > 0}
                                                 form='form'/>
                            </StyledTableCell>
                            <StyledTableCell/>
                            <StyledTableCell/>
                            <StyledTableCell/>
                            <StyledTableCell><IconButton type='submit' form='form'>
                                <AddCircleIcon/>
                            </IconButton></StyledTableCell>
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <p id='errorMessage'>{props.errors.map(function (el) {
                if(el.errorCode > 0) return <span>{el.errorMessage}</span>;
            })}</p>
        </div>
    );
}