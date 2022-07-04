import React, { useState, useEffect, useRef, useContext } from "react";

import { useHistory, useParams } from "react-router-dom";
import { parseISO, format, isSameDay } from "date-fns";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import IconButton from '@material-ui/core/IconButton';
import { i18n } from "../../translate/i18n";
//import DoneIcon from '@material-ui/icons/Done';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ReplayIcon from '@material-ui/icons/Replay';
import api from "../../services/api";
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import MarkdownWrapper from "../MarkdownWrapper";
import { Tooltip } from "@material-ui/core";
import { AuthContext } from "../../context/Auth/AuthContext";
import toastError from "../../errors/toastError";
import ButtonWithSpinner from "../ButtonWithSpinner";

const useStyles = makeStyles(theme => ({
	ticket: {
		position: "relative",
	},

	pendingTicket: {
		cursor: "unset",
	},

	noTicketsDiv: {
		display: "flex",
		height: "100px",
		margin: 40,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},

	noTicketsText: {
		textAlign: "center",
		color: "rgb(104, 121, 146)",
		fontSize: "14px",
		lineHeight: "1.4",
	},

	noTicketsTitle: {
		textAlign: "center",
		fontSize: "16px",
		fontWeight: "600",
		margin: "0px",
	},

	contactNameWrapper: {
		display: "flex",
		justifyContent: "space-between",
	},

	lastMessageTime: {
		justifySelf: "flex-end",
	},

	closedBadge: {
		alignSelf: "center",
		justifySelf: "flex-end",
		marginRight: 32,
		marginLeft: "auto",
	},

	contactLastMessage: {
		paddingRight: 80,
	},

	newMessagesCount: {
		position: "absolute",
		left: "3%",
		bottom: 45,
		fontSize: "0.8em",
		padding: 1,
		paddingLeft: 2,
		paddingRight: 2,
		borderRadius: 5,
	},

	bottomButton: {
		top: "12px",
		left: "3%",
	},

	badgeStyle: {
		color: "white",
		backgroundColor: green[600],
		fontSize: "0.8em",
		width: -10,
	},

	acceptButton: {
		position: "absolute",
		left: "0.5%",
		bottom: 1,
		fontSize: "0.8em",
		padding: 1,
		paddingLeft: 2,
		paddingRight: 2,
		borderRadius: 5,
	},

	ticketQueueColor: { // Barra lateral do lado da foto nos tickets
		flex: "none",
		width: "8px",
		height: "100%",
		position: "absolute",
		top: "0%",
		left: "0%",
	},

	userTag: {
		position: "absolute",
		marginRight: 5,
		right: 5,
		bottom: 30,
		//backgroundColor: theme.palette.background.default,
		color: theme.palette.primary.main,
		//border: "1px solid #CCC",
		padding: 1,
		paddingLeft: 5,
		paddingRight: 5,
		borderRadius: 10,
		fontSize: "0.9em",
		fontWeight: "900"
	},
}));

const TicketListItem = ({ ticket }) => {
	const classes = useStyles();
	const history = useHistory();
	const [loading, setLoading] = useState(false);
	const { ticketId } = useParams();
	const isMounted = useRef(true);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);
			// Nome Responsável  *********************************************************************************************************************
	const [zdg, setZDG] = useState(null);

	if (ticket.status === "pending"){

	} else {

	const fetchZDG = async () => {
		try {
			const { data } = await api.get("/users/" + ticket.userId, {
			});
			setZDG(data['name']);
		} catch (err) {
			toastError(err);
		}
		};
	fetchZDG();
	}

	const handleAcepptTicket = async id => {
		setLoading(true);
		try {
			// Abrir Chamado *********************************************************************************************************************
			var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
				
			let _data = JSON.stringify({
				usuario: user.name,
				telefone: ticket.contact.number,
				email: user.email,
				ticket: id
			})

			var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: _data,
			redirect: 'follow'
			};
			fetch('https://heradash.bubbleapps.io/api/1.1/wf/aceitar/', requestOptions)
			.then(response => response.text())
			.then(result => console.log(result))
			.catch(error => console.log('error', error));
			//***********************************************************************************************************************************
			await api.put(`/tickets/${id}`, {
				status: "open",
				userId: user?.id,
			});
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
		if (isMounted.current) {
			setLoading(false);
		}
		history.push(`/tickets/${id}`);
	};

	const handleReopenTicket = async id => {
		setLoading(true);
		try {
			await api.put(`/tickets/${id}`, {
				status: "open",
				userId: user?.id,
			});
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
		if (isMounted.current) {
			setLoading(false);
		}
		history.push(`/tickets/${id}`);
	};

	const handleViewTicket = async id => {
		setLoading(true);
		try {
			await api.put(`/tickets/${id}`, {
				status: "pending",
			});
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
		if (isMounted.current) {
			setLoading(false);
		}
		history.push(`/tickets/${id}`);
	};

	const handleClosedTicket = async id => {
		setLoading(true);
		try {
			await api.put(`/tickets/${id}`, {
				status: "closed",
				userId: user?.id,
			});
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
		if (isMounted.current) {
			setLoading(false);
		}
		// history.push(`/tickets/${id}`);
	};


	const handleSelectTicket = id => {
		history.push(`/tickets/${id}`);
		//**************************************************
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		let _data = JSON.stringify({
		usuario: user.name,
		telefone: ticket.contact.number,
		email: user.email, 
		ticket: id
		})

		var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: _data,
		redirect: 'follow'
		};
		fetch('https://heradash.bubbleapps.io/api/1.1/wf/clique/', requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
		//**************************************************
	};

	return (
		<React.Fragment key={ticket.id}>
			<ListItem
				dense
				button
				onClick={e => {
					if (ticket.status === "pending") return;
					handleSelectTicket(ticket.id);
				}}
				selected={ticketId && +ticketId === ticket.id}
				className={clsx(classes.ticket, {
					[classes.pendingTicket]: ticket.status === "pending",
				})}
			>
				<Tooltip
					arrow
					placement="right"
					title={ticket.queue?.name || "Sem fila"}
				>
					<span
						style={{ backgroundColor: ticket.queue?.color || "#7C7C7C" }}
						className={classes.ticketQueueColor}
					></span>
				</Tooltip>
				<ListItemAvatar>
					<Avatar src={ticket?.contact?.profilePicUrl} />
				</ListItemAvatar>
				<ListItemText
					disableTypography
					primary={
						<span className={classes.contactNameWrapper}>
							<Typography
								noWrap
								component="span"
								variant="body2"
								color="textPrimary"
							>
								{ticket.contact.name}
							</Typography>
							{ticket.lastMessage && (
								<Typography
									className={classes.lastMessageTime}
									component="span"
									variant="body2"
									color="textSecondary"
								>
									{isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
										<>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
									) : (
										<>{format(parseISO(ticket.updatedAt), "dd/MM/yyyy")}</>
									)}
								</Typography>
							)}
							{ticket.whatsapp && (
								<div className={classes.userTag} title={i18n.t("ticketsList.connectionTitle")}>{zdg}</div>
							)}
						</span>
					}
					secondary={
						<span className={classes.contactNameWrapper}>
							<Typography
								className={classes.contactLastMessage}
								noWrap
								component="span"
								variant="body2"
								color="textSecondary"
							>
								{ticket.lastMessage ? (
									<MarkdownWrapper>{ticket.lastMessage}</MarkdownWrapper>
								) : (
									<br />
								)}
							</Typography>

							<Badge
								className={classes.newMessagesCount}
								badgeContent={ticket.unreadMessages}
								classes={{
									badge: classes.badgeStyle,
								}}
							/>
						</span>
					}
				/>
				{ticket.status === "pending" && (
					<Tooltip title={i18n.t("Aceitar")}>
					<ButtonWithSpinner
						color="primary"
						variant="contained"
						className={classes.acceptButton}
						loading={loading}
						onClick={e => handleAcepptTicket(ticket.id)}
						>
						{i18n.t("ticketsList.buttons.accept")}
					</ButtonWithSpinner>
					</Tooltip>
				)}
				{ticket.status === "pending" && ( // Visualizar Pendente
					<Tooltip title={i18n.t("Visualizar")}>
						<IconButton
							className={classes.bottomButton}
							size="small"
							color="primary"
							onClick={e => handleViewTicket(ticket.id)} >
							<VisibilityIcon />
						</IconButton>
					</Tooltip>
				)}
				{ticket.status === "pending" && ( // Encerrar de quando
					<Tooltip title={i18n.t("Encerrar")}>
						<IconButton
							className={classes.bottomButton}
							color="primary"
							onClick={e => handleClosedTicket(ticket.id)} >
							<ClearOutlinedIcon />
						</IconButton>
					</Tooltip>
				)}
				{ticket.status === "open" && (
					<Tooltip title={i18n.t("Reabrir")}>
						<IconButton
							className={classes.bottomButton}
							size="small"
							color="primary"
							onClick={e => handleViewTicket(ticket.id)} >
							<ReplayIcon />
						</IconButton>
					</Tooltip>
				)}
				{ticket.status === "open" && ( //Botão encerrar a lista de Tickets
					<Tooltip title={i18n.t("Encerrar")}>
						<IconButton 
							className={classes.bottomButton}
							color="primary"
							onClick={e => handleClosedTicket(ticket.id)} >
							<ClearOutlinedIcon />
						</IconButton>
					</Tooltip>
				)}
				{ticket.status === "closed" && (
					<IconButton
						className={classes.bottomButton}
						color="primary"
						onClick={e => handleReopenTicket(ticket.id)} >
						<ReplayIcon />
					</IconButton>
				)}
				{ticket.status === "closed" && (
					<IconButton
						className={classes.bottomButton}
						color="primary" >
					</IconButton>
				)}
			</ListItem>
			<Divider variant="inset" component="li" />
		</React.Fragment>
	);
};

export default TicketListItem;