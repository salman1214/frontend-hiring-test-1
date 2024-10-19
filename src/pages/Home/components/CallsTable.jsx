import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import Button from '../../../components/Button';
import { caplitalize, secondsToHms } from '../../../utils/extras';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Divider } from '@mui/material';
import pusher from '../../../services/pusher';
import { addNote, toggleArchive } from '../../../services';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: '2px',
    boxShadow: 24,
    p: 4,
};

const callTypeColors = {
    answered: "text-[#1DC9B7]",
    missed: "text-[#C91D3E]",
    voicemail: "text-[#325AE7]",
}

const CallsTable = ({ data, statusFilter, reload, loading, setLoading }) => {
    const [errorState, setErrorState] = useState("")
    
    const [open, setOpen] = useState(false);
    const [call, setCall] = useState(null)
    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setCall(null);
        setOpen(false)
    };

    const toggleArchiveCall = (id) => {
        setLoading(true)
        toggleArchive(id).then(res => {
            console.log(res.data);
            reload();
        }
        ).catch(err => {
            console.log(err.response)
        })
    }

    const handleError = (msg) => {
        setErrorState(msg)
        setTimeout(() => {
            setErrorState("")
        }, 2000)
    }

    const handleAddNote = (e) => {
        e.preventDefault();

        if (!call) {
            handleError("Invalid call ID");
            return;
        }
        if (!e.target.note.value) {
            handleError("Please add a note");
            return;
        }
        setLoading(true)
        addNote(call.id, e.target.note.value).then(res => {
            // console.log(res.data);
            setCall(res.data);
            e.target.note.value = "";
            reload();
        }
        ).catch(err => {
            console.log(err.response)
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (!call) return;
        // Listen for real-time updates
        const channel = pusher.subscribe('private-aircall');
        channel.bind('update-call', (data) => {
            if (data.id === call.id) {
                console.log('Call updated in real-time:', data);
            }
        });

        return () => {
            // Unsubscribe from Pusher when the component unmounts
            channel.unbind('update-call');
            pusher.unsubscribe('private-aircall');
        };
    }, [call?.id]);
    return (
        <div>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, height: 500 }} aria-label="simple table">
                    <TableHead>
                        <TableRow className='bg-[#f4f4f8]'>
                            <TableCell><span className='text-xs font-semibold'>CALL TYPE</span></TableCell>
                            <TableCell><span className='text-xs font-semibold'>DIRECTION</span></TableCell>
                            <TableCell><span className='text-xs font-semibold'>DURATION</span></TableCell>
                            <TableCell><span className='text-xs font-semibold'>FROM</span></TableCell>
                            <TableCell><span className='text-xs font-semibold'>TO</span></TableCell>
                            <TableCell><span className='text-xs font-semibold'>VIA</span></TableCell>
                            <TableCell><span className='text-xs font-semibold'>CREATED AT</span></TableCell>
                            <TableCell><span className='text-xs font-semibold'>STATUS</span></TableCell>
                            <TableCell><span className='text-xs font-semibold'>ACTION</span></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                        data?.filter((row) => statusFilter === 10 ? row : statusFilter === 20 ? row.is_archived : !row.is_archived).length > 0 ?
                        data?.filter((row) => statusFilter === 10 ? row : statusFilter === 20 ? row.is_archived : !row.is_archived)
                        .map((row, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        <span className={`text-xs ${callTypeColors[row.call_type]}`}>{caplitalize(row?.call_type)}</span>
                                    </TableCell>
                                    <TableCell><span className='text-xs text-[#325AE7]'>{caplitalize(row?.direction)}</span></TableCell>
                                    <TableCell>
                                        <span className='text-xs'>{secondsToHms(row.duration)}</span>
                                        <br />
                                        <span className='text-xs text-[#325AE7]'>{"(" + row.duration + ")"} seconds</span>
                                    </TableCell>
                                    <TableCell><span className='text-xs'>{row.from}</span></TableCell>
                                    <TableCell><span className='text-xs'>{row.to}</span></TableCell>
                                    <TableCell><span className='text-xs'>{row.via}</span></TableCell>
                                    <TableCell><span className='text-xs'>{moment(row.created_at).subtract(10, 'days').calendar()}</span></TableCell>
                                    <TableCell>
                                        {loading && call?.id === row.id ? <span className='text-xs cursor-pointer'>
                                            <div className={`${row.is_archived ? "text-[#1DC9B7] bg-[#d3f9f5]" : "text-[#727272] bg-gray-100"} flex justify-center items-center h-8 rounded`}>
                                                Loading...
                                            </div>
                                        </span>
                                            :
                                            <span className='text-xs cursor-pointer' onClick={() => { setCall(row); toggleArchiveCall(row?.id) }}>
                                                <div className={`${row.is_archived ? "text-[#1DC9B7] bg-[#d3f9f5]" : "text-[#727272] bg-gray-100"} flex justify-center items-center h-8 rounded`}>
                                                    {row.is_archived ? "Archived" : "Unarchive"}
                                                </div>
                                            </span>}
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => { setCall(row); handleOpen() }}><span className='text-xs'>Add Note</span></Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                        :
                        <TableRow>
                            <TableCell colSpan={9} className='w-full flex justify-center'>
                                <div className='text-center text-base'>No data found</div>
                            </TableCell>
                        </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='flex justify-between items-center'>
                        <div>
                            <div className='mb-2'>Add Notes</div>
                            <div className='text-xs text-[#325AE7]'>Call ID: {call?.id}</div>
                        </div>
                        <CloseIcon className='cursor-pointer' onClick={handleClose} color='primary' sx={{ fontSize: 27 }} />
                    </div>

                    <Divider sx={{ marginTop: 2, marginBottom: 3 }} />

                    {call && <div className='flex gap-3'>
                        <div className='flex flex-col gap-3'>
                            <div className='text-xs font-medium'>Call Type</div>
                            <div className='text-xs font-medium'>Duration</div>
                            <div className='text-xs font-medium'>From</div>
                            <div className='text-xs font-medium'>To</div>
                            <div className='text-xs font-medium'>Via</div>
                        </div>
                        <div className='flex flex-col gap-3'>
                            <div className={`text-xs ${callTypeColors[call.call_type]}`}>{caplitalize(call.call_type)}</div>
                            <div className='text-xs'>{secondsToHms(call?.duration)}</div>
                            <div className='text-xs'>{call?.from}</div>
                            <div className='text-xs'>{call?.to}</div>
                            <div className='text-xs'>{call?.via}</div>
                        </div>
                    </div>}

                    {call && <div>
                        {
                            call.notes?.map((note, index) => (
                                <div key={index} className='mt-2'>
                                    <label className='text-sm font-medium'>Note {index + 1}</label>
                                    <div className='text-xs text-gray-500'>{note.content}</div>
                                </div>
                            ))
                        }

                    </div>}

                    <form onSubmit={handleAddNote}>

                        <div className='mt-2'>
                            <label className='text-sm font-medium'>Notes</label>
                            <textarea name='note' className='w-full h-32 p-2 border border-gray-300 rounded' placeholder='Add notes'></textarea>
                        </div>

                        <Divider sx={{ marginBottom: 3 }} />

                        <Button disabled={loading} type="submit" style="w-full"><span className='text-xs'>{loading ? "Loading..." : "Save"}</span></Button>
                    </form>
                    {errorState && <Alert severity="error" className='mt-2'>{errorState}.</Alert>}
                </Box>
            </Modal>

        </div>
    )
}

export default CallsTable