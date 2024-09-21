export class Option {
  constructor(label, value, description, variable=null){
    this.params = {
      label, value, description, variable
    }
    this.isDeleted = false
  }

  delete(){
    this.isDeleted = true
  }

  changeValue(key, value) {
    this.params[key] = value
  }

  label() {
    return this.params.label
  }

  value() {
    return this.params.value
  }

  description() {
    return this.params.description
  }

  variable() {
    return this.params.variable
  }

  json() {
    if (!this.isDeleted) {
      return {
        label: this.label(),
        value: this.value(),
        description: this.description()
      }
    } else {
      return {}
    }
  }



}
