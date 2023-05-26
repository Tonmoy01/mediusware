import React, { useState, useMemo } from 'react'

const Problem1 = () => {
  const [data, setData] = useState([])
  const [show, setShow] = useState('all')

  const finalData = useMemo(() => {
    const filteredData =
      show === 'all'
        ? data
        : data.filter((item) => item.status.toLowerCase() === show)

    const activeData = []
    const completedData = []
    const otherData = []

    filteredData.forEach((item) => {
      const status = item.status.toLowerCase()

      if (status === 'active') activeData.push(item)
      else if (status === 'completed') completedData.push(item)
      else otherData.push(item)
    })

    return [...activeData, ...completedData, ...otherData]
  }, [data, show])

  function formSubmitHandler(e) {
    e.preventDefault()

    const form = e.target
    const formData = {
      name: form.elements.name.value,
      status: form.elements.status.value,
    }

    setData((old) => [...old, formData])
    form.reset()
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-1</h4>
        <div className="col-6 ">
          <form
            className="row gy-2 gx-3 align-items-center mb-4"
            onSubmit={formSubmitHandler}
          >
            <div className="col-auto">
              <input
                required
                type="text"
                className="form-control"
                placeholder="Name"
                name="name"
              />
            </div>
            <div className="col-auto">
              <input
                required
                type="text"
                className="form-control"
                placeholder="Status"
                name="status"
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="col-8">
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${show === 'all' && 'active'}`}
                type="button"
                onClick={() => setShow('all')}
              >
                All
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === 'active' && 'active'}`}
                type="button"
                onClick={() => setShow('active')}
              >
                Active
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === 'completed' && 'active'}`}
                type="button"
                onClick={() => setShow('completed')}
              >
                Completed
              </button>
            </li>
          </ul>
          <div className="tab-content"></div>
          <table className="table table-striped ">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
              </tr>

              {finalData.map(({ name, status }, i) => (
                <tr key={i}>
                  <td scope="col">{name}</td>
                  <td scope="col">{status}</td>
                </tr>
              ))}
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Problem1
