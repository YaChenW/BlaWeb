let statusMachine = function(){
  this.Status = true
  this.getStatus = function(){
    return this.status
  }
  this.setStatus = function(bool){
    this.status = bool || true
  }
}

module.exports = statusMachine
