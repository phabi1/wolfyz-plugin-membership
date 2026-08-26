import { Button, Card, CardBody, CardFooter, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Page from "../components/ui/Page";

export default function HomePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/wp-json/wolf-memberships/v1/campaigns")
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Page title={__("Campaigns", "wolf-membership")}>

      {loading ? (
        <Spinner />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((item) => (
            <Card
              key={item.id}>
              <CardBody>
                {item.title}
              </CardBody>
              <CardFooter>
                <Link
                  to={`/campaign/${item.id}`}
                >
                  <Button variant="primary">
                    {__("View Campaign", "wolf-membership")}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
