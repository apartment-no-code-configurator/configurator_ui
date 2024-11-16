import { Loader } from "semantic-ui-react";

export const CLoader = (props) => {
  const styles = {
    position: "relative",
    height: props.height || "200px"
  }
  return <div className="loader-container" style={styles}><Loader active /></div>
}