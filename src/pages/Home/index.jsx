import React, { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { MenuItem, Pagination, Select } from '@mui/material';
import CallsTable from './components/CallsTable';
import { API, getCalls } from '../../services';

const Home = () => {
    const [loading, setLoading] = useState(false)
    const [reFetch, setReFetch] = useState(false)
    const reload = () => setReFetch(!reFetch)
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        limit: 6,
        totalPages: 0
    })
    const [calls, setCalls] = useState([])
    useEffect(() => {
        let offset = (pageInfo.page - 1) * pageInfo.limit;
        getCalls({ offset: offset, limit: pageInfo.limit }).then(res => {
            setCalls(res.data.nodes)
            setPageInfo({
                ...pageInfo,
                totalPages: Math.ceil(res.data.totalCount / pageInfo.limit)
            })
        }).catch(err => {
            console.log(err.response)
        }).finally(() => setLoading(false))
    }, [pageInfo.page, reFetch])

    return (
        <div className='flex justify-center'>

            <div className='w-[90%] mt-8 flex flex-col gap-4'>
                <h1 className='text-[28px]'>Turing Technologies Frontend Test</h1>
                <div className='flex gap-2 items-center'>
                    <div>Filter by:</div>
                    <FormControl className='w-32' size='small'>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={age}
                            label="Status"
                            // onChange={handleChange}
                            color='primary'
                        >
                            <MenuItem value={10}>All</MenuItem>
                            <MenuItem value={20}>Archived</MenuItem>
                            <MenuItem value={30}>UnArchived</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <CallsTable
                    data={calls}
                    reload={reload}
                    loading={loading}
                    setLoading={setLoading}
                />

                <div className='flex justify-center mb-20'>
                    <div className='flex flex-col items-center'>
                        <Pagination
                            color='primary'
                            count={pageInfo.totalPages} shape="rounded"
                            page={pageInfo.page}
                            onChange={(e, value) => setPageInfo({ ...pageInfo, page: value })}
                        />
                        {(pageInfo.page - 1) * pageInfo.limit + 1} - {pageInfo.page * pageInfo.limit} of {pageInfo.totalPages * pageInfo.limit} results
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Home