import axios from 'axios';
import { refreshPage } from '../utils/Utils';
import { Option } from './OptionLib';
import { API_HOST } from '../utils/Constants';

export class Variable {
  constructor(statusObj=null, name=null, description=null, datatype="text", apiName=null, id=null, options="[]") {
    this.statusObj = statusObj;
    this.name = name;
    this.description = description;
    this.dataType = datatype;
    this.apiName = apiName;
    this.id = id;
    options = typeof options === "string" ? JSON.parse(options) : options;
    this.options = options.map((option) => {
      return new Option(option["label"], option["value"], option["description"], this)
    });
  }

  setStatusObj(statusObj) {
    this.statusObj = statusObj;
  }
  setName(name) {
    this.name = name;
  }

  setDescription(description) {
    this.description = description;
  }

  addOption(newOption) {
    this.options.push(newOption);
  }

  editOption(index, newOption) {
    this.options[index] = newOption;
  }

  deleteOption(index) {
    this.options[index].delete();
  }

  setDataType(datatype) {
    this.dataType = datatype;
  }

  createOrUpdateVariable = (statusId) => {
    const payload = {
      "status_variable": {
        "name": this.name,
        "description": this.description,
        "datatype": this.dataType,
        "options": JSON.stringify(this.options.filter((option) => option.isDeleted === false).map((option) => option.json()))
      }, "status": {
        "id": statusId
      }
    }

    if (this.id !== null) {
      payload["status_variable"]["id"] = this.id
    }

    try {
      axios.put(`https://${API_HOST}/workflow_service/status_variables`, payload, {
        headers: this.generateHeaders()
      }).then((response) => {
        //TO-DO: Correct the response handling
        if (response.status === 201) {
          console.log("status variable creation response")
          console.log(response)
          alert(`Variable successfully ${this.id === null ? "created" : "updated"}`)
          // refreshPage()
          //TO-DO: Check for id updation if variable is created newly
          this.apiName = response.data.apiName
          return true
        } else {
          throw response.json()
        }
      })
    } catch(error) {
      console.log(error)
      return false
    }
  }

  generateHeaders(){
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}`
    }
  }
}
