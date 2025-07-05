import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 20 },
    section: { marginBottom: 10 },
    heading: { fontSize: 18, marginBottom: 5 },
    text: { fontSize: 12 },
});

function MyDocument(props) {
    return React.createElement(
        Document,
        null,
        React.createElement(
            Page,
            { style: styles.page },
            React.createElement(
                View,
                { style: styles.section },
                React.createElement(Text, { style: styles.heading }, props.name),
                React.createElement(Text, { style: styles.text }, props.summary)
            ),
            React.createElement(
                View,
                { style: styles.section },
                React.createElement(Text, { style: styles.heading }, "Education"),
                React.createElement(Text, { style: styles.text }, props.education)
            ),
            React.createElement(
                View,
                { style: styles.section },
                React.createElement(Text, { style: styles.heading }, "Experience"),
                React.createElement(Text, { style: styles.text }, props.experience)
            ),
            React.createElement(
                View,
                { style: styles.section },
                React.createElement(Text, { style: styles.heading }, "Skills"),
                React.createElement(Text, { style: styles.text }, props.skills)
            ),
            React.createElement(
                View,
                { style: styles.section },
                React.createElement(Text, { style: styles.heading }, "Projects"),
                React.createElement(Text, { style: styles.text }, props.projects)
            ),
            React.createElement(
                View,
                { style: styles.section },
                React.createElement(Text, { style: styles.heading }, "Languages"),
                React.createElement(Text, { style: styles.text }, props.languages)
            ),
            React.createElement(
                View,
                { style: styles.section },
                React.createElement(Text, { style: styles.heading }, "Interests"),
                React.createElement(Text, { style: styles.text }, props.interests)
            ),
            React.createElement(
                View,
                { style: styles.section },
                React.createElement(Text, { style: styles.heading }, "Certificates"),
                React.createElement(Text, { style: styles.text }, props.certificates)
            ),
            React.createElement(
                View,
                { style: styles.section },
                React.createElement(Text, { style: styles.heading }, "Contact"),
                React.createElement(Text, { style: styles.text }, props.contact)
            )
        )
    );
}

export default MyDocument;
